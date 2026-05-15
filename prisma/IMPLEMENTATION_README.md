# Holland Code Assessment Implementation Guide

## Overview

This project now includes a comprehensive career interest assessment based on the Holland Code (RIASEC) model, which matches personality types with career paths. The system includes **155 questions** across three age groups:

- **Group A (Class 8-10)**: 30 questions on interests and hobbies
- **Group B (Class 11-12)**: 50 questions on stream alignment
- **Group C (College+)**: 75 questions on professional fit

## What is the Holland Code?

The Holland Code (RIASEC) theory by John L. Holland categorizes people and jobs into six personality types:

| Code | Type | Description | Typical Careers |
|------|------|-------------|-----------------|
| **R** | Realistic | Practical, hands-on, mechanical work | Engineer, Technician, Mechanic, Farmer |
| **I** | Investigative | Analytical, scientific, research-oriented | Scientist, Data Analyst, Researcher |
| **A** | Artistic | Creative, expressive, design-focused | Artist, Designer, Writer, Musician |
| **S** | Social | Helping, teaching, serving others | Teacher, Nurse, Counselor, Social Worker |
| **E** | Enterprising | Leadership, business, influencing | Business Owner, Manager, Salesperson |
| **C** | Conventional | Organized, detail-oriented, structured | Accountant, Administrator, Analyst |

## Quick Start

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add-holland-code-support
```

### 2. Seed the Questions

```bash
npx tsx prisma/holland-code-seed.ts
```

This will add all 155 questions to your database, categorized by class level.

### 3. Test the Feature

1. Login as a student
2. Navigate to **Student Dashboard** → **Take Assessment**
3. Complete the Interest Discovery Test
4. View your Holland Code results

## Project Structure

### Core Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema with Holland Code types |
| `prisma/holland-code-seed.ts` | Database seeding script |
| `src/app/api/student/test/questions/route.ts` | API endpoint for fetching questions |
| `src/app/api/student/test/submit/route.ts` | API endpoint for submitting and scoring |
| `src/app/student/holland-codes/page.tsx` | Results display page |
| `prisma/holland-code-questions/interest-questions.ts` | Question data file |

### File Locations

```
ai-guide/
├── prisma/
│   ├── schema.prisma                    # Database schema
│   ├── holland-code-seed.ts             # Seeding script
│   ├── holland-code-questions/
│   │   └── interest-questions.ts        # Question data
│   └── MIGRATION_SUMMARY.md             # Migration details
├── src/
│   └── app/
│       └── student/
│           ├── test/page.tsx            # Assessment interface
│           └── holland-codes/page.tsx   # Results page
```

## Database Schema Changes

### Updated QuestionType Enum

```prisma
enum QuestionType {
  INTEREST
  APTITUDE
  PERSONALITY
  LEARNING_STYLE
  VALUES
  REALISTIC      // NEW: R type
  INVESTIGATIVE // NEW: I type
  ARTISTIC      // NEW: A type
  SOCIAL        // NEW: S type
  ENTERPRISING  // NEW: E type
  CONVENTIONAL  // NEW: C type
}
```

### Updated Question Model

```prisma
model Question {
  id          String           @id @default(cuid())
  text        String           @db.Text
  type        QuestionType
  hollandCode String?          // NEW: Holland Code type (R, I, A, S, E, C)
  classMin    Int              @default(6)
  classMax    Int              @default(12)
  forAssessment AssessmentType @default(CLUSTER)
  sortOrder   Int              @default(0)
  isActive    Boolean          @default(true)
  options     QuestionOption[]
  answers     AssessmentAnswer[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}
```

## Question Distribution by Class Level

| Class Level | Question Count | Assessment Type |
|-------------|----------------|-----------------|
| 6-10        | 30             | Interest Discovery |
| 11-12       | 50             | Stream Alignment |
| 13+         | 75             | Professional Fit |

## Career Mapping Logic

The system maps Holland Codes to career clusters:

| Holland Code | Career Clusters |
|--------------|-----------------|
| **R** | Engineering, Defence & Security, Science & Research |
| **I** | Science & Research, Technology & IT, Medical & Healthcare |
| **A** | Arts & Humanities, Technology & IT, Business & Commerce |
| **S** | Medical & Healthcare, Education & Teaching, Government & Civil Services |
| **E** | Business & Commerce, Law & Legal, Government & Civil Services |
| **C** | Business & Commerce, Government & Civil Services, Technology & IT |

## API Endpoints

### GET `/api/student/test/questions`

Fetches assessment questions based on student's class level.

**Response:**
```json
{
  "assessmentId": "clxxxxx",
  "questions": [
    {
      "id": "q1",
      "text": "I like to build things with my hands",
      "type": "R",
      "options": [...]
    }
  ]
}
```

### POST `/api/student/test/submit`

Submits assessment and calculates Holland Code scores.

**Request:**
```json
{
  "assessmentId": "clxxxxx",
  "answers": [
    { "questionId": "q1", "optionId": "o1" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "name": "Engineering",
      "score": 24,
      "percentage": 80
    }
  ],
  "hollandCodes": [
    {
      "code": "R",
      "title": "Realistic",
      "description": "Practical, hands-on, mechanical work",
      "score": 12
    }
  ],
  "recommendations": [
    "You have strong interests in practical, hands-on activities...",
    "Consider careers in engineering, trades, or technical fields..."
  ]
}
```

## Results Page (`/student/holland-codes`)

The new results page displays:

1. **Holland Code Cards** - Shows top 3 personality types with scores, descriptions, and keywords
2. **Career Cluster Recommendations** - Shows top 5 career clusters with match percentages
3. **Personalized Recommendations** - Tailored guidance based on dominant codes
4. **Next Steps** - Summary of career fit and exploration suggestions

## Customization Guide

### Adding More Questions

Edit `prisma/holland-code-questions/interest-questions.ts`:

```typescript
const NEW_QUESTIONS: HollandQuestion[] = [
  { 
    id: 156, 
    text: "I enjoy [activity].", 
    type: "R", // R, I, A, S, E, or C
    classMin: 8, 
    classMax: 10 
  },
  // ... add more
];
```

### Adjusting Career Mapping

Edit `prisma/holland-code-seed.ts`:

```typescript
const clusterMapping: Record<string, string[]> = {
  R: ["Engineering", "Defence & Security"],  // Add/remove clusters
  I: ["Science & Research", "Technology & IT"],
  // ... adjust as needed
};
```

### Modifying Recommendations

Edit `src/app/api/student/test/submit/route.ts`:

```typescript
function getRecommendations(hollandResults) {
  switch (hollandResults[0].code) {
    case "R":
      return [
        "Your customized recommendation...",
        // ... add more
      ];
    // ... adjust other cases
  }
}
```

## Troubleshooting

### Issue: "No questions available yet"

**Solution:** Run the seeding script:
```bash
npx tsx prisma/holland-code-seed.ts
```

### Issue: Questions not showing for specific class level

**Solution:** Check the `classMin` and `classMax` values in `interest-questions.ts` match your test class level.

### Issue: Results not displaying

**Solution:** Ensure the assessment is marked as `COMPLETED` in the database and the student has answered questions.

### Issue: Database migration error

**Solution:** 
1. Check your database connection in `.env`
2. Run `npx prisma migrate status`
3. Check for existing migrations with conflicts

## Maintenance

### View Question Statistics

After seeding, the script outputs:
```
R (Realistic): 26
I (Investigative): 25
A (Artistic): 25
S (Social): 26
E (Enterprising): 24
C (Conventional): 29
```

### Reset and Re-seed

```bash
# Drop and recreate database
npx prisma migrate reset

# Re-seed everything
npx prisma db seed
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the database migration logs
3. Verify API responses in browser DevTools Network tab

## Future Enhancements

- Add more questions for each Holland Code type
- Integrate aptitude tests alongside interest assessments
- Add career-specific questions for top cluster recommendations
- Include video content or interactive elements in the assessment
- Implement a "Career Match" feature comparing student profile to job descriptions

---

**Status**: ✅ Implementation Complete  
**Last Updated**: Migration Summary Created  
**Next Steps**: Run `npx prisma migrate dev` and `npx tsx prisma/holland-code-seed.ts`
