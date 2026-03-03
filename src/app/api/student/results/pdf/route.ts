import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── SVG Radar Chart ────────────────────────────────────────────────────────────
function buildRadar(clusters: { name: string; percentage: number }[], size = 320): string {
  const cx = size / 2, cy = size / 2, r = size / 2 - 56;
  const n = Math.min(clusters.length, 8);
  const slices = clusters.slice(0, n);
  const step = (2 * Math.PI) / n;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const pt = (i: number, rr: number) => {
    const a = step * i - Math.PI / 2;
    return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
  };

  const gridLines = gridLevels.map((lvl) => {
    const pts = slices.map((_, i) => pt(i, r * lvl));
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
    return `<path d="${d}" fill="none" stroke="#e9ecef" stroke-width="1"/>`;
  });

  const spokes = slices.map((_, i) => {
    const p = pt(i, r);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#e9ecef" stroke-width="1"/>`;
  });

  const dataPts = slices.map((c, i) => pt(i, (r * c.percentage) / 100));
  const polyD = dataPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  const dots = dataPts.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#e63946" stroke="#fff" stroke-width="2"/>`);

  const labels = slices.map((c, i) => {
    const lp = pt(i, r + 34);
    const anchor = lp.x < cx - 10 ? "end" : lp.x > cx + 10 ? "start" : "middle";
    const name = c.name.length > 14 ? c.name.slice(0, 13) + "…" : c.name;
    return `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="${anchor}" font-size="9.5" font-weight="600" fill="#495057">${name}</text>
<text x="${lp.x.toFixed(1)}" y="${(lp.y + 15).toFixed(1)}" text-anchor="${anchor}" font-size="8.5" fill="#e63946" font-weight="700">${c.percentage.toFixed(0)}%</text>`;
  });

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e63946" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ff6b6b" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  ${gridLines.join("\n  ")}
  ${spokes.join("\n  ")}
  <path d="${polyD}" fill="url(#rg)" stroke="#e63946" stroke-width="2.5" stroke-linejoin="round"/>
  ${dots.join("\n  ")}
  ${labels.join("\n  ")}
</svg>`;
}

// ── SVG Horizontal Bar Chart ───────────────────────────────────────────────────
function buildBarChart(
  items: { name: string; value: number; color: string }[],
  width = 480,
): string {
  const barH = 22, gap = 10, labelW = 172, pctW = 36;
  const innerW = width - labelW - pctW - 20;
  const height = items.length * (barH + gap) + 16;

  const bars = items.map((item, i) => {
    const y = 8 + i * (barH + gap);
    const fillW = Math.max(4, (innerW * item.value) / 100);
    const shortName = item.name.length > 24 ? item.name.slice(0, 23) + "…" : item.name;
    return `
  <text x="0" y="${y + 15}" font-size="9.5" fill="#333" font-weight="600" text-anchor="start">${shortName}</text>
  <rect x="${labelW}" y="${y}" width="${innerW}" height="${barH}" rx="5" fill="#f1f3f5"/>
  <rect x="${labelW}" y="${y}" width="${fillW.toFixed(1)}" height="${barH}" rx="5" fill="${item.color}"/>
  <text x="${labelW + innerW + 6}" y="${y + 15}" font-size="9.5" fill="${item.color}" font-weight="700">${item.value.toFixed(0)}%</text>`;
  });

  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${bars.join("")}
</svg>`;
}

// ── Donut / Arc for Match Confidence ──────────────────────────────────────────
function buildDonut(value: number, size = 110): string {
  const r = 42, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (circ * value) / 100;
  const color = value >= 75 ? "#51cf66" : value >= 50 ? "#f4a261" : "#e63946";
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f3f5" stroke-width="10"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
    stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
    stroke-dashoffset="${(circ / 4).toFixed(1)}" stroke-linecap="round"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="17" font-weight="800" fill="${color}">${value}%</text>
  <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="8" fill="#6c757d" font-weight="600">MATCH</text>
</svg>`;
}

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const [profile, user, clusterAssessment, branchAssessment, allClusters] = await Promise.all([
      prisma.studentProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
      prisma.assessment.findFirst({
        where: { userId: session.user.id, type: "CLUSTER", status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        include: { results: { orderBy: { rank: "asc" }, include: { cluster: true } }, recommendation: true },
      }),
      prisma.assessment.findFirst({
        where: { userId: session.user.id, type: "BRANCH", status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        include: { branchResults: { orderBy: { rank: "asc" }, include: { branch: { include: { cluster: true } } } }, recommendation: true },
      }),
      // Fetch cluster metadata managed by admin
      prisma.careerCluster.findMany({ select: { name: true, salary: true, colleges: true, education: true, growth: true, examKey: true } }),
    ]);

    if (!clusterAssessment) return new NextResponse("No results found", { status: 404 });

    // Build a metadata map from DB (admin-managed), fallback to empty string
    const CAREER_META: Record<string, { salary: string; colleges: string; education: string; growth: string; examKey: string }> =
      Object.fromEntries(
        allClusters.map((c) => [
          c.name,
          {
            salary:    c.salary    ?? "",
            colleges:  c.colleges  ?? "",
            education: c.education ?? "",
            growth:    c.growth    ?? "",
            examKey:   c.examKey   ?? "",
          },
        ]),
      );

    const recommendation = branchAssessment?.recommendation || clusterAssessment?.recommendation;
    const clusterResults = clusterAssessment.results.map((r) => ({
      name: r.cluster.name,
      percentage: r.percentage,
      ...(CAREER_META[r.cluster.name] || {}),
    }));
    const branchResults = (branchAssessment?.branchResults || []).map((r) => ({
      name: r.branch.name,
      clusterName: r.branch.cluster.name,
      percentage: r.percentage,
    }));

    const topClusters = clusterResults.slice(0, 8);
    const topBranches = branchResults.slice(0, 8);
    const top3 = clusterResults.slice(0, 3);

    const now = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    const confidence = Math.min(99, Math.round(clusterResults[0]?.percentage ?? 70));

    // ── Build charts ────────────────────────────────────────────────────────
    const radarSVG = buildRadar(topClusters.map((c) => ({ name: c.name, percentage: c.percentage })));
    const clusterBarSVG = buildBarChart(
      topClusters.map((c, i) => ({
        name: c.name,
        value: c.percentage,
        color: i === 0 ? "#e63946" : i === 1 ? "#ff6b6b" : "#4361ee",
      })),
    );
    const branchBarSVG = topBranches.length
      ? buildBarChart(
          topBranches.map((b, i) => ({
            name: b.name,
            value: b.percentage,
            color: i === 0 ? "#4361ee" : "#6b8bff",
          })),
        )
      : "";
    const donutSVG = buildDonut(confidence);

    // ── Action‑plan rows by class ────────────────────────────────────────────
    const level = Number(profile?.classLevel || 10);
    const actionItems =
      level <= 8
        ? ["Build strong fundamentals in all subjects", "Explore clubs & activities to discover your interests", "Read about careers that fascinate you", "Develop good study habits and time management", "Talk to professionals in fields you find exciting"]
        : level <= 10
        ? ["Choose your stream wisely: Science / Commerce / Humanities", "Start coaching or online courses for your target career", "Prepare for relevant entrance exams (see exam keys below)", "Build practical skills through projects & competitions", "Connect with mentors in your chosen field"]
        : ["Focus intensely on entrance‑exam preparation", "Research colleges and their admission requirements", "Build your portfolio — projects, certificates, internships", "Attend career fairs and open days at target colleges", "Apply to multiple colleges and maintain backup plans"];

    const actionRows = actionItems
      .map(
        (item, i) =>
          `<tr>
            <td style="width:28px;vertical-align:top;padding:6px 8px 6px 0">
              <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#e63946,#ff6b6b);color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;">${i + 1}</div>
            </td>
            <td style="padding:6px 0;font-size:12px;color:#333;line-height:1.5">${item}</td>
          </tr>`,
      )
      .join("");

    // ── Career‑roadmap cards ─────────────────────────────────────────────────
    const roadmapCards = top3
      .map((c) => {
        const meta = CAREER_META[c.name];
        const pct = c.percentage.toFixed(0);
        return `
      <div style="border:1px solid #e9ecef;border-radius:12px;padding:16px;margin-bottom:14px;page-break-inside:avoid">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:14px;font-weight:800;color:#1a1a2e">${c.name}</span>
          <span style="font-size:12px;font-weight:700;color:#e63946;background:#fff0f1;padding:2px 10px;border-radius:20px">${pct}%</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#f8f9fa;border-radius:8px;padding:8px">
            <div style="font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">💰 Salary Range</div>
            <div style="font-size:11px;font-weight:600;color:#333">${meta?.salary || "—"}</div>
          </div>
          <div style="background:#f8f9fa;border-radius:8px;padding:8px">
            <div style="font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">📈 Market Growth</div>
            <div style="font-size:11px;font-weight:600;color:#333">${meta?.growth || "—"}</div>
          </div>
          <div style="background:#f8f9fa;border-radius:8px;padding:8px">
            <div style="font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">🎓 Education Path</div>
            <div style="font-size:11px;font-weight:600;color:#333">${meta?.education || "—"}</div>
          </div>
          <div style="background:#f8f9fa;border-radius:8px;padding:8px">
            <div style="font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">📝 Key Exams</div>
            <div style="font-size:11px;font-weight:600;color:#333">${meta?.examKey || "—"}</div>
          </div>
        </div>
        <div style="background:#f8f9fa;border-radius:8px;padding:8px;margin-top:8px">
          <div style="font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">🏫 Top Colleges</div>
          <div style="font-size:11px;font-weight:600;color:#333">${meta?.colleges || "—"}</div>
        </div>
      </div>`;
      })
      .join("");

    const validate =
      recommendation?.claimValidation === "MATCHED"
        ? `<div style="display:inline-block;background:#d3f9d8;color:#2f9e44;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-top:8px">✓ Matches your self‑claimed career</div>`
        : recommendation?.claimValidation === "MISMATCHED" && profile?.selfClaimedCareer
        ? `<div style="display:inline-block;background:#fff3cd;color:#d97706;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-top:8px">You claimed: ${profile.selfClaimedCareer} — AI recommends something different</div>`
        : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Career Report — ${user?.name || "Student"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',system-ui,sans-serif;color:#1a1a2e;background:#fff;font-size:13px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:18mm 14mm 14mm}
  @media print{body{print-color-adjust:exact}.no-print{display:none!important}}
  section{margin-bottom:22px;page-break-inside:avoid}
  h2{font-size:14px;font-weight:800;color:#1a1a2e;margin-bottom:12px;display:flex;align-items:center;gap:6px}
  h2::after{content:'';flex:1;height:1.5px;background:linear-gradient(90deg,#e63946 0%,transparent 100%);display:block}
  .page{max-width:760px;margin:0 auto;padding:0 4px}
  /* ── Header ── */
  .hdr{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;border-radius:16px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
  .hdr-logo{display:flex;align-items:center;gap:10px}
  .hdr-logo .dot{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#e63946,#ff6b6b);display:flex;align-items:center;justify-content:center;font-size:18px}
  .hdr-logo .brand{font-size:22px;font-weight:900;letter-spacing:-0.5px}
  .hdr-logo .brand span{color:#ff6b6b}
  .hdr-right{text-align:right;font-size:11px;color:rgba(255,255,255,.65);line-height:1.7}
  /* ── Info strip ── */
  .info-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
  .info-cell{background:#f8f9fa;border-radius:10px;padding:10px 12px}
  .info-cell .lbl{font-size:9px;color:#6c757d;text-transform:uppercase;letter-spacing:.7px;margin-bottom:2px}
  .info-cell .val{font-size:13px;font-weight:800;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  /* ── Best fit hero ── */
  .hero{background:linear-gradient(135deg,#e63946 0%,#ff6b6b 100%);border-radius:14px;padding:22px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;color:#fff}
  .hero-left .tag{font-size:9px;text-transform:uppercase;letter-spacing:2px;opacity:.85;margin-bottom:4px}
  .hero-left .career{font-size:26px;font-weight:900;line-height:1.1;margin-bottom:2px}
  .hero-backups{display:flex;gap:10px;margin-top:12px}
  .hero-backups .bk{background:rgba(255,255,255,.18);border-radius:8px;padding:6px 14px}
  .hero-backups .bk .bk-lbl{font-size:8.5px;text-transform:uppercase;letter-spacing:.5px;opacity:.8}
  .hero-backups .bk .bk-val{font-size:12px;font-weight:700}
  /* ── Charts grid ── */
  .charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .chart-box{background:#fafafa;border:1px solid #e9ecef;border-radius:12px;padding:14px;display:flex;flex-direction:column;align-items:center}
  .chart-box .ch-title{font-size:10px;font-weight:700;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;align-self:flex-start}
  /* ── Print button ── */
  .print-btn{position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#e63946,#ff6b6b);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(230,57,70,.35)}
  .print-btn:hover{transform:translateY(-2px)}
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="hdr">
    <div class="hdr-logo">
      <div class="dot">🎯</div>
      <div>
        <div class="brand">ai<span>Guide</span></div>
        <div style="font-size:10px;color:rgba(255,255,255,.55);font-weight:500;margin-top:1px">AI‑Powered Career Guidance</div>
      </div>
    </div>
    <div class="hdr-right">
      <div><strong style="color:#fff">Career Analysis Report</strong></div>
      <div>Generated: ${now}</div>
      <div>${user?.email || ""}</div>
    </div>
  </div>

  <!-- Student info strip -->
  <div class="info-strip">
    <div class="info-cell"><div class="lbl">Student Name</div><div class="val">${user?.name || "—"}</div></div>
    <div class="info-cell"><div class="lbl">Class / Grade</div><div class="val">${profile?.classLevel ? "Class " + profile.classLevel : "—"}</div></div>
    <div class="info-cell"><div class="lbl">School</div><div class="val">${profile?.school || "—"}</div></div>
    <div class="info-cell"><div class="lbl">Self‑Claimed Career</div><div class="val">${profile?.selfClaimedCareer || "Not specified"}</div></div>
  </div>

  <!-- Best Fit Hero -->
  ${
    recommendation
      ? `<div class="hero">
    <div class="hero-left">
      <div class="tag">🏆 Best Fit Career</div>
      <div class="career">${recommendation.bestFitBranch}</div>
      ${validate}
      <div class="hero-backups">
        ${recommendation.backup1Branch ? `<div class="bk"><div class="bk-lbl">Backup 1</div><div class="bk-val">${recommendation.backup1Branch}</div></div>` : ""}
        ${recommendation.backup2Branch ? `<div class="bk"><div class="bk-lbl">Backup 2</div><div class="bk-val">${recommendation.backup2Branch}</div></div>` : ""}
      </div>
    </div>
    <div style="text-align:center">
      ${donutSVG}
      <div style="font-size:9px;color:rgba(255,255,255,.75);margin-top:4px;text-transform:uppercase;letter-spacing:.5px">Confidence Score</div>
    </div>
  </div>`
      : ""
  }

  <!-- Charts Section -->
  <section>
    <h2>📊 Assessment Score Analysis</h2>
    <div class="charts-grid">
      <div class="chart-box">
        <div class="ch-title">Radar — Career Cluster Profile</div>
        ${radarSVG}
      </div>
      <div class="chart-box" style="justify-content:center">
        <div class="ch-title">Cluster Score Breakdown</div>
        ${clusterBarSVG}
      </div>
    </div>
  </section>

  ${
    branchBarSVG
      ? `<section>
    <h2>🎯 Branch Score Breakdown</h2>
    <div class="chart-box" style="align-items:flex-start">
      <div class="ch-title">Top Branch Scores</div>
      ${branchBarSVG}
    </div>
  </section>`
      : ""
  }

  <!-- Career Roadmap -->
  <section>
    <h2>🗺 Career Roadmap — Top 3 Matches</h2>
    ${roadmapCards}
  </section>

  <!-- AI Analysis -->
  ${
    recommendation?.reasoning
      ? `<section>
    <h2>💡 AI Analysis &amp; Insights</h2>
    ${recommendation.reasoning ? `<div style="background:#fff8f8;border-left:3px solid #e63946;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:10px;font-size:12px;color:#333;line-height:1.7"><strong style="display:block;margin-bottom:4px">Why This Career?</strong>${recommendation.reasoning}</div>` : ""}
    ${recommendation.riskFactors ? `<div style="background:#fff3e0;border-left:3px solid #f4a261;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:10px;font-size:12px;color:#333;line-height:1.7"><strong style="display:block;margin-bottom:4px">⚠️ Risk Factors</strong>${recommendation.riskFactors}</div>` : ""}
    ${recommendation.realityCheck ? `<div style="background:#ebfbee;border-left:3px solid #51cf66;border-radius:0 10px 10px 0;padding:12px 16px;font-size:12px;color:#333;line-height:1.7"><strong style="display:block;margin-bottom:4px">🎯 Reality Check</strong>${recommendation.realityCheck}</div>` : ""}
  </section>`
      : ""
  }

  <!-- Action Plan -->
  <section>
    <h2>📋 Recommended Action Plan</h2>
    <div style="border:1px solid #e9ecef;border-radius:12px;padding:16px">
      <div style="font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:10px">For Class ${profile?.classLevel || ""} Student — Next Steps</div>
      <table style="width:100%;border-collapse:collapse">${actionRows}</table>
    </div>
  </section>

  <!-- Footer -->
  <div style="border-top:1.5px solid #e9ecef;padding-top:14px;display:flex;justify-content:space-between;align-items:center;margin-top:4px">
    <div style="font-size:10px;color:#6c757d">
      <strong style="color:#e63946">aiGuide</strong> — AI‑Powered Career Guidance Platform<br/>
      This report is a guidance tool. Consult a career counselor for personalized advice.
    </div>
    <div style="font-size:10px;color:#6c757d;text-align:right">
      Report generated on ${now}<br/>
      Confidential — for student use only
    </div>
  </div>

</div>

<!-- Print button (hidden when printing) -->
<button class="print-btn no-print" onclick="window.print()">🖨️ Download / Print PDF</button>

<script>
  // Auto-open print dialog after fonts load
  window.addEventListener('load', function() {
    setTimeout(function() { window.print(); }, 900);
  });
</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
