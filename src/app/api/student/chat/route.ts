import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 seconds initial delay for retry

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  stream: boolean = false,
  attempt: number = 1
): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "google/gemma-3-12b-it:free";

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME || "aiGuide",
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
    }),
  });

  // Retry on rate limit (429) or server errors (5xx) for free models
  if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
    console.warn(
      `OpenRouter request failed (status ${res.status}), retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})...`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return callOpenRouter(messages, stream, attempt + 1);
  }

  return res;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({
      reply:
        "AI counselor is not configured yet. Please ask your admin to add an OPENROUTER_API_KEY in the environment variables.",
    });
  }

  try {
    const { message, history, stream: useStream, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Persist user message to DB if sessionId provided
    if (sessionId) {
      await prisma.chatMessage.create({
        data: { sessionId, role: "user", content: message },
      });

      // Auto-generate title from first message if still "New Chat"
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { title: true },
      });
      if (chatSession?.title === "New Chat") {
        const autoTitle = message.length > 50 ? message.slice(0, 47) + "..." : message;
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { title: autoTitle },
        });
      }
    }

    // Fetch student context for personalized responses
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Get latest assessment results
    const clusterAssessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "CLUSTER",
        status: "COMPLETED",
      },
      orderBy: { completedAt: "desc" },
      include: {
        results: {
          orderBy: { rank: "asc" },
          take: 5,
          include: { cluster: true },
        },
        recommendation: true,
      },
    });

    const branchAssessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "BRANCH",
        status: "COMPLETED",
      },
      orderBy: { completedAt: "desc" },
      include: {
        branchResults: {
          orderBy: { rank: "asc" },
          take: 5,
          include: { branch: true },
        },
        recommendation: true,
      },
    });

    // Build context about the student
    const topClusters =
      clusterAssessment?.results
        .map((r) => `${r.cluster.name} (${r.percentage.toFixed(0)}%)`)
        .join(", ") || "Not assessed yet";
    const topBranches =
      branchAssessment?.branchResults
        .map((r) => `${r.branch.name} (${r.percentage.toFixed(0)}%)`)
        .join(", ") || "Not assessed yet";
    const recommendation =
      branchAssessment?.recommendation || clusterAssessment?.recommendation;

    // Determine language level instructions based on class
    const classLevel = profile?.classLevel ?? 0;
    let languageInstruction: string;
    if (classLevel <= 8 && classLevel >= 1) {
      languageInstruction = `LANGUAGE LEVEL — Class ${classLevel} (Junior):
- Use very simple, easy English that a young student can understand
- Avoid difficult words and technical jargon completely
- Explain every career term in plain words (e.g., "Engineers build things like bridges and apps")
- Keep sentences short and clear
- Use lots of friendly emojis to keep it fun
- Focus on "what does this person do every day" style explanations
- Mention 1-2 subjects they should study well right now
- Do NOT mention entrance exam details yet — too early; just say "study hard in school"`;
    } else if (classLevel <= 10) {
      languageInstruction = `LANGUAGE LEVEL — Class ${classLevel} (Middle/Secondary):
- Use clear, moderately easy English — some career terms are okay if explained briefly
- Student is starting to think seriously about streams (Science/Commerce/Arts after Class 10)
- Focus heavily on stream selection advice and what each stream leads to
- Mention key entrance exams by name (JEE, NEET, CLAT, NDA, etc.) but explain them simply
- Provide 2-3 actionable steps they can take right now in Class ${classLevel}
- Encourage subject choices that match their interests
- Keep tone friendly and motivating`;
    } else {
      languageInstruction = `LANGUAGE LEVEL — Class ${classLevel} (Senior Secondary):
- Use confident, mature English — student is ready for detailed, professional advice
- Give specific entrance exam preparation strategies (JEE, NEET, UPSC, CLAT, CAT, NDA, etc.)
- Mention specific college names, cut-offs, and admission processes
- Discuss career roadmaps: degree → specialization → job roles → growth path
- Include salary ranges and job market outlook where relevant
- Provide actionable monthly/yearly study plans
- Be direct and thorough — student needs comprehensive guidance for life decisions`;
    }

    const systemPrompt = `You are an AI Career Counselor for Indian students on the aiGuide platform. Your role is to provide personalized, helpful, and encouraging career guidance.

STUDENT CONTEXT:
- Name: ${user?.name || "Student"}
- Class: ${classLevel || "Unknown"}
- School: ${profile?.school || "Not specified"}
- City/State: ${profile?.city || ""}, ${profile?.state || ""}
- Self-Claimed Career Interest: ${profile?.selfClaimedCareer || "Not specified"}
- Top Career Cluster Matches: ${topClusters}
- Top Branch Matches: ${topBranches}
- Best Fit Recommendation: ${recommendation?.bestFitBranch || "Not available yet"}
- Backup Options: ${recommendation?.backup1Branch || "N/A"}, ${recommendation?.backup2Branch || "N/A"}

${languageInstruction}

GUIDELINES:
1. Be warm, encouraging and supportive — remember these are young students (class 6-12)
2. Give India-specific advice — mention Indian exams (JEE, NEET, UPSC, CLAT, NDA, etc.), colleges (IITs, AIIMS, NITs, IIMs, NLUs), and career paths
3. Use the student's assessment results to provide personalized advice
4. If they ask about a career that doesn't match their assessment, gently explain the mismatch but encourage them to explore
5. Provide actionable steps appropriate for their class level — strictly follow the LANGUAGE LEVEL instructions above
6. Keep responses concise but informative (2-3 paragraphs max)
7. Add relevant emojis to make the chat feel friendly
8. If asked non-career questions, politely redirect to career guidance
9. Always be honest about competition levels and effort required

FORMATTING:
- Use **bold** for key terms and career names
- Use bullet points (- ) for listing steps, colleges, or exams
- Use short paragraphs for readability
- When listing steps, number them (1. 2. 3.)
- Use headers with ### for sections when giving detailed advice`;

    // Build message array for OpenRouter (OpenAI-compatible format)
    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add chat history
    if (history && Array.isArray(history)) {
      for (const h of history) {
        messages.push({
          role: h.role === "user" ? "user" : "assistant",
          content: h.content,
        });
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Streaming mode
    if (useStream) {
      const response = await callOpenRouter(messages, true);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter stream error:", response.status, errorText);
        return NextResponse.json({
          reply:
            "Sorry, I encountered an error connecting to the AI service. Please try again in a moment. 🙏",
        });
      }

      const capturedSessionId = sessionId;
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const readable = new ReadableStream({
        async start(controller) {
          let fullReply = "";
          try {
            const reader = response.body?.getReader();
            if (!reader) {
              controller.close();
              return;
            }

            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;
                const data = trimmed.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                  );
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices?.[0]?.delta?.content || "";
                  if (text) {
                    fullReply += text;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed JSON chunks
                }
              }
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            controller.close();
          } catch (err) {
            console.error("Stream error:", err);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: "Sorry, I encountered an error. Please try again. 🙏", done: true })}\n\n`
              )
            );
            controller.close();
          } finally {
            // Persist assistant reply to DB
            if (capturedSessionId && fullReply) {
              prisma.chatMessage.create({
                data: { sessionId: capturedSessionId, role: "assistant", content: fullReply },
              }).catch((e: Error) => console.error("Failed to save assistant message:", e));
            }
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming (fallback) — also uses retry
    const response = await callOpenRouter(messages, false);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return NextResponse.json({
        reply:
          "Sorry, I encountered an error connecting to the AI service. Please try again in a moment. 🙏",
      });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // Persist assistant reply to DB
    if (sessionId && reply) {
      await prisma.chatMessage.create({
        data: { sessionId, role: "assistant", content: reply },
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      reply:
        "Sorry, I encountered an error. Please try again in a moment. 🙏",
    });
  }
}
