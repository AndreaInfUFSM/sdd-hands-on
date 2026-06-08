# API Schema Reference: Challenge of the Day

This document serves as a reference for the API contract and data structures used in the UI Backend Integration feature.

## Backend API Endpoints

All endpoints follow the query-based action pattern: `?action=ACTION_NAME`

### 1. getConfig

Fetches application configuration.

**Request**:
```
GET /apps-script-url?action=getConfig
```

**Response** (200 OK):
```json
{
  "course_name": "Programming Paradigms",
  "timezone": "America/Sao_Paulo",
  "allow_manual_name": true,
  "challenge_selection_mode": "date",
  "frontend_version": "1.0.0"
}
```

**Default Values** (if backend unavailable):
```json
{
  "course_name": "Challenge of the Day",
  "timezone": "America/Sao_Paulo",
  "allow_manual_name": true,
  "challenge_selection_mode": "date",
  "frontend_version": "1.0.0"
}
```

### 2. getStudents

Fetches list of enrolled students for autocomplete.

**Request**:
```
GET /apps-script-url?action=getStudents
```

**Response** (200 OK):
```json
[
  { "student_id": "s001", "display_name": "Ana Silva" },
  { "student_id": "s002", "display_name": "Bruno Costa" },
  { "student_id": "s003", "display_name": "Carla Mendes" },
  { "student_id": "s004", "display_name": "Diego Rocha" },
  { "student_id": "s005", "display_name": "Elisa Nunes" }
]
```

### 3. getActiveChallenge

Fetches the currently active challenge.

**Request**:
```
GET /apps-script-url?action=getActiveChallenge
```

**Response** (200 OK):
```json
{
  "challenge": {
    "challenge_id": "java-oop-2026-001",
    "version": 1,
    "title": "Reference vs Object",
    "topics": ["Java", "OOP", "references"],
    "difficulty": "introductory",
    "intro": [
      {
        "type": "markdown",
        "content": "A common confusion in Java is treating variables and objects as if they were the same thing."
      }
    ],
    "prompt": [
      {
        "type": "code",
        "language": "java",
        "content": "class Box {\n  private int value;\n  public Box(int value) { this.value = value; }\n  public void setValue(int value) { this.value = value; }\n  public int getValue() { return this.value; }\n}\n\nBox a = new Box(10);\nBox b = a;\nb.setValue(20);\nSystem.out.println(a.getValue());"
      },
      {
        "type": "question",
        "content": "What is printed and why?"
      }
    ],
    "response": {
      "type": "mixed",
      "fields": [
        {
          "id": "choice",
          "type": "single_choice",
          "label": "Choose the best answer",
          "required": true,
          "options": [
            {
              "id": "a",
              "label": "10, because changing b does not affect a."
            },
            {
              "id": "b",
              "label": "20, because a and b reference the same object."
            },
            {
              "id": "c",
              "label": "Compilation error, because two variables cannot reference the same object."
            },
            {
              "id": "d",
              "label": "Runtime error, because b was not created with new."
            }
          ],
          "correct_option_id": "b"
        },
        {
          "id": "explanation",
          "type": "open_text",
          "label": "Explain your reasoning",
          "required": true,
          "min_length": 30,
          "placeholder": "Explain the difference between the variable and the object..."
        }
      ]
    },
    "feedback": {
      "mode": "answer-key",
      "messages": {
        "correct": "Correct! The variable b receives a copy of the reference stored in a, so both variables reference the same Box object.",
        "incorrect": "Not quite. Remember that assignment copies the reference, not the object itself."
      },
      "after_submission": [
        {
          "type": "markdown",
          "content": "A useful mental model: variables of object types store references. The object lives elsewhere, and more than one variable can reference it."
        }
      ]
    }
  }
}
```

### 4. submitResponse

Submits a student's response to a challenge.

**Request**:
```
POST /apps-script-url?action=submitResponse
Content-Type: application/json

{
  "challenge_id": "java-oop-2026-001",
  "challenge_version": 1,
  "student_id": "s001",
  "student_display_name": "Ana Silva",
  "student_source": "listed",
  "response_json": {
    "choice": { "type": "single_choice", "value": "b" },
    "explanation": { "type": "open_text", "value": "The variable b gets a copy of the reference, so both point to the same Box object. When we call setValue(20) on b, we're modifying the object that a also points to." }
  },
  "frontend_version": "1.0.0",
  "elapsed_seconds": 120
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "feedback_json": {
    "mode": "answer-key",
    "details": [
      {
        "type": "answer-key",
        "field": "choice",
        "selected": "b",
        "correct": true,
        "message": "Correct! The variable b receives a copy of the reference stored in a, so both variables reference the same Box object."
      }
    ]
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid challenge_id or version"
}
```

## Challenge Schema Specification

### Challenge Object

```typescript
interface Challenge {
  challenge_id: string;        // Unique identifier (e.g., "java-oop-2026-001")
  version: number;             // Semantic version for tracking changes
  title: string;               // Display title
  topics: string[];            // Learning topics/tags (e.g., ["Java", "OOP"])
  difficulty: string;          // Difficulty level (e.g., "introductory", "intermediate")
  intro?: Block[];             // Introductory content blocks
  prompt?: Block[];            // Challenge prompt/question blocks
  response?: ResponseForm;      // Response form schema
  feedback?: FeedbackConfig;    // Feedback configuration
}
```

### Block Types

#### Markdown Block
```typescript
interface MarkdownBlock {
  type: "markdown";
  content: string;             // Plain text (will be HTML-escaped)
}
```

#### Code Block
```typescript
interface CodeBlock {
  type: "code";
  language: string;            // Programming language (e.g., "java", "python", "javascript")
  content: string;             // Code content (will be HTML-escaped)
}
```

#### Question Block
```typescript
interface QuestionBlock {
  type: "question";
  content: string;             // Question text (will be HTML-escaped)
}
```

#### Callout Block
```typescript
interface CalloutBlock {
  type: "callout";
  style: string;               // Visual style (e.g., "reflection", "note", "warning")
  content: string;             // Callout content (will be HTML-escaped)
}
```

#### Image Block
```typescript
interface ImageBlock {
  type: "image";
  url: string;                 // Image URL
  alt: string;                 // Alt text for accessibility
  caption?: string;            // Optional caption (will be HTML-escaped)
}
```

### Response Form Types

#### Single Choice Field
```typescript
interface SingleChoiceField {
  id: string;                  // Field identifier
  type: "single_choice";
  label: string;               // Field label
  required: boolean;
  options: Array<{
    id: string;                // Option identifier (e.g., "a", "b", "c")
    label: string;             // Option label (will be HTML-escaped)
  }>;
  correct_option_id?: string;  // For answer-key feedback mode
}
```

#### Open Text Field
```typescript
interface OpenTextField {
  id: string;
  type: "open_text";
  label: string;
  required: boolean;
  placeholder?: string;
  min_length?: number;         // Minimum characters required
}
```

#### Code Field
```typescript
interface CodeField {
  id: string;
  type: "code";
  label: string;
  required: boolean;
  placeholder?: string;
  min_length?: number;
  language?: string;           // Hint for syntax highlighting
}
```

#### Mixed Response
```typescript
interface MixedResponse {
  type: "mixed";
  fields: (SingleChoiceField | OpenTextField | CodeField)[];
}
```

### Feedback Modes

#### Static Feedback
```typescript
interface StaticFeedback {
  mode: "static";
  message?: string;            // Static feedback message
}
```

#### Answer Key Feedback
```typescript
interface AnswerKeyFeedback {
  mode: "answer-key";
  messages?: {
    correct?: string;
    incorrect?: string;
  };
  correct_option_id?: string;
  choice_feedback?: { ... };
}
```

#### Rule-based Feedback
```typescript
interface RuleBasedFeedback {
  mode: "rule-based";
  explanation_rules?: Array<{
    id: string;
    condition: {
      type: "contains_any";
      terms: string[];
    };
    message: string;
  }>;
  default_message?: string;
}
```

#### Hybrid Feedback
```typescript
interface HybridFeedback {
  mode: "hybrid";
  choice_feedback?: { ... };
  explanation_rules?: { ... };
}
```

## Examples from Current Fixtures

### Java Reference vs Object Challenge

See `challenge-fixtures.js` fixture: `java-reference-vs-object`

**Key elements**:
- Mixed response with single_choice and open_text fields
- Answer-key feedback with correct option marked
- After-submission markdown block with conceptual explanation
- Difficulty level: "introductory"

### Java Static vs Instance Challenge

See `challenge-fixtures.js` fixture: `java-static-vs-instance`

**Key elements**:
- Single choice field asking about class vs instance attributes
- Open text field asking for explanation
- Multiple feedback messages
- Markdown after-submission content
- Difficulty level: "introductory"

### Imperative Programming Challenge

See `mock-data.js`: `mockBootstrap.challenge`

**Key elements**:
- Markdown intro with context
- Code block with JavaScript example
- Callout block with reflection prompt
- Question block asking for reasoning
- Mixed response with single_choice and open_text
- After-submission including code comparison
- All English language content

## Existing Fixture Data as Schema Documentation

The following fixtures serve as concrete examples of valid challenge structures:

1. **Java OOP Challenges** (from `challenge-fixtures.js`):
   - `java-reference-vs-object`: References vs objects
   - `java-static-vs-instance`: Static vs instance attributes
   - Additional challenges for method parameters, inheritance, polymorphism

2. **Programming Paradigms** (from `mock-data.js`):
   - Imperative vs functional programming
   - Demonstrates callout blocks and after-submission comparisons

These fixtures demonstrate:
- All supported block types
- All response field types
- Mixed response forms
- Feedback structures
- Multi-language support (Portuguese and English)
- Validation constraints (min_length, required)

## Usage in Frontend Integration

When implementing the UI Backend Integration feature:

1. **Remove** hardcoded fixture imports from variant-4-selector
2. **Remove** challenge selector logic and UI
3. **Fetch** challenges dynamically from `getActiveChallenge` endpoint
4. **Render** challenges using the same block and field rendering functions, now applied to backend data
5. **Use** these examples for testing and documentation of the schema

The rendering logic remains unchanged; only the data source changes from hardcoded fixtures to backend API calls.

