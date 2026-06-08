# Challenge Schema Reference

This document describes the structure of challenge objects used by the variant-4-selector UI.

## Table of Contents
- [Challenge Object](#challenge-object)
- [Blocks](#blocks)
- [Response Model](#response-model)
- [Examples](#examples)
- [Field Types](#field-types)

---

## Challenge Object

The main challenge object contains the title, description, and response model.

```typescript
{
  id: string;              // Unique identifier for the challenge
  title: string;           // Challenge title (displayed prominently)
  description?: string;    // Optional description
  difficulty?: string;     // Difficulty level (e.g., "Easy", "Medium", "Hard")
  topics?: string[];       // Array of topic tags
  intro?: Block[];         // Introduction blocks (shown before prompt)
  prompt?: Block[];        // Prompt/question blocks (shown after intro)
  response: ResponseModel; // The response/answer model
}
```

### Example Challenge

```json
{
  "id": "design-patterns-001",
  "title": "Understanding Design Patterns",
  "difficulty": "Medium",
  "topics": ["Design Patterns", "OOP"],
  "intro": [
    {
      "type": "markdown",
      "content": "Design patterns are reusable solutions to common programming problems."
    }
  ],
  "prompt": [
    {
      "type": "question",
      "content": "What is the MVC pattern and when would you use it?"
    }
  ],
  "response": {
    "type": "mixed",
    "fields": [
      {
        "id": "pattern_name",
        "type": "single_choice",
        "label": "Which pattern is described above?",
        "required": true,
        "options": [
          { "id": "a", "label": "MVC" },
          { "id": "b", "label": "Observer" },
          { "id": "c", "label": "Factory" }
        ]
      },
      {
        "id": "explanation",
        "type": "open_text",
        "label": "Explain your reasoning",
        "required": true,
        "min_length": 50
      }
    ]
  }
}
```

---

## Blocks

Challenge content is composed of blocks. Each block has a `type` field that determines its structure.

### Supported Block Types

#### 1. Markdown Block
Plain text content (HTML escaped).

```json
{
  "type": "markdown",
  "content": "This is formatted as plain text. **Bold text will appear as text.**"
}
```

#### 2. Question Block
A highlighted question or prompt.

```json
{
  "type": "question",
  "content": "What is the purpose of design patterns?"
}
```

#### 3. Code Block
Source code with language identifier.

```json
{
  "type": "code",
  "language": "java",
  "content": "public class Example {\n  public static void main(String[] args) {\n    System.out.println(\"Hello\");\n  }\n}"
}
```

#### 4. Callout Block
Highlighted callout for important information.

```json
{
  "type": "callout",
  "style": "reflection",
  "content": "Remember: Always consider the trade-offs when choosing a pattern."
}
```

#### 5. Image Block
Embedded image (URL must be accessible).

```json
{
  "type": "image",
  "url": "https://example.com/diagram.png",
  "alt": "MVC Pattern Diagram",
  "caption": "Figure 1: Model-View-Controller Architecture"
}
```

---

## Response Model

The response model defines how students answer the challenge.

### Response Model Types

#### 1. Mixed Response (Multiple Fields)
```json
{
  "type": "mixed",
  "fields": [
    { "id": "field1", "type": "single_choice", ... },
    { "id": "field2", "type": "open_text", ... }
  ]
}
```

#### 2. Open Text Response
```json
{
  "type": "open_text",
  "label": "Your answer",
  "required": true,
  "min_length": 100
}
```

#### 3. Code Response
```json
{
  "type": "code",
  "label": "Write your implementation",
  "required": true,
  "min_length": 50
}
```

---

## Field Types

Individual response fields support different types:

### 1. Single Choice (Multiple Choice)
```json
{
  "id": "choice_field",
  "type": "single_choice",
  "label": "Choose one option",
  "required": true,
  "options": [
    { "id": "a", "label": "Option A" },
    { "id": "b", "label": "Option B" },
    { "id": "c", "label": "Option C" }
  ]
}
```

### 2. Open Text
```json
{
  "id": "text_field",
  "type": "open_text",
  "label": "Your response",
  "required": true,
  "min_length": 50,
  "placeholder": "Enter your answer here..."
}
```

### 3. Code Field
```json
{
  "id": "code_field",
  "type": "code",
  "label": "Write the code",
  "required": true,
  "min_length": 20,
  "placeholder": "public class MyClass {\n  // Your code here\n}"
}
```

### Field Properties

- `id` (string, required): Unique field identifier
- `type` (string, required): Field type (single_choice, open_text, code)
- `label` (string, required): Display label for the field
- `required` (boolean, optional): Whether the field must be filled (default: false)
- `min_length` (number, optional): Minimum character length for text fields
- `placeholder` (string, optional): Placeholder text for input fields
- `options` (array, required for single_choice): Array of option objects

---

## Submission Format

When a student submits a response, the request body should contain:

```json
{
  "studentId": "s001",
  "studentName": "Alice Silva",
  "challengeId": "design-patterns-001",
  "response": {
    "pattern_name": "a",
    "explanation": "MVC separates concerns by dividing the application into Model, View, and Controller layers..."
  }
}
```

---

## Feedback Response

After submission, the backend returns feedback:

```json
{
  "status": "correct",
  "content": "Excellent! Your understanding of MVC is correct."
}
```

### Feedback Status Values
- `correct`: Answer is fully correct
- `incorrect`: Answer is wrong
- `partial`: Answer is partially correct or needs more explanation

---

## Examples from Fixtures

These examples are derived from the existing challenge fixtures.

### Example 1: Java OOP Challenge (Portuguese)

See `frontend-playground/shared/challenge-fixtures.js` for the complete Java OOP example.

```json
{
  "id": "java-oop-inheritance",
  "title": "Herança em Java",
  "difficulty": "Médio",
  "topics": ["Programação Orientada a Objetos", "Java"],
  "prompt": [
    {
      "type": "question",
      "content": "Qual é o propósito de herança em programação orientada a objetos?"
    }
  ],
  "response": {
    "type": "mixed",
    "fields": [
      {
        "id": "inheritance_purpose",
        "type": "open_text",
        "label": "Explique o propósito de herança",
        "required": true,
        "min_length": 80
      }
    ]
  }
}
```

### Example 2: Programming Paradigms Challenge

See `frontend-playground/shared/mock-data.js` for complete Paradigms example.

```json
{
  "id": "paradigms-001",
  "title": "Programming Paradigms",
  "difficulty": "Intermediário",
  "topics": ["Paradigmas de Programação"],
  "prompt": [
    {
      "type": "markdown",
      "content": "Entenda as diferentes abordagens para resolver problemas em programação..."
    }
  ],
  "response": {
    "type": "single_choice",
    "label": "Qual paradigma melhor se aplica?",
    "required": true,
    "options": [...]
  }
}
```

---

## Implementation Notes

### Rendering Challenges

The variant-4-selector UI renders challenges using the following process:

1. Fetch challenge from `/getActiveChallenge` endpoint
2. Render `intro` blocks
3. Render `prompt` blocks
4. Render response form based on `response.type`
5. Display feedback from `/submitResponse` endpoint

### Content Safety

All content from the backend is **HTML escaped** before display to prevent XSS attacks:

```javascript
// Example: How content is rendered
const escapedContent = escapeHtml(block.content);
// Result: "<" becomes "&lt;", ">" becomes "&gt;", etc.
```

### Browser Compatibility

The variant-4-selector UI uses:
- ES6 JavaScript modules (import/export)
- Standard Fetch API
- CSS Grid and Flexbox
- FormData API

Supports modern browsers (Chrome, Firefox, Safari, Edge) from 2020+.

---

## Testing

To test challenge rendering, you can use the existing fixtures:

```javascript
// Load a fixture
import { challengeFixtures } from '../shared/challenge-fixtures.js';
const testChallenge = challengeFixtures[0].challenge;

// Render it
renderChallenge(testChallenge);
renderResponseForm(testChallenge.response);
```

---

## Version History

- **v1.0** (2026-06-08): Initial schema documentation
  - Support for mixed response fields
  - Multiple block types
  - Full HTML escaping

---

## References

- [API Schema Reference](../../../specs/001-ui-backend-integration/API-SCHEMA-REFERENCE.md)
- [Challenge Fixtures](../shared/challenge-fixtures.js)
- [Mock Data](../shared/mock-data.js)
- [variant-4-selector README](../README.md)
