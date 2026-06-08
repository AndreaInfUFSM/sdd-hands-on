export const mockBootstrap = {
  app: {
    course_name: "Programming Paradigms",
    allow_manual_name: true,
    timezone: "America/Sao_Paulo"
  },

  students: [
    { student_id: "s001", display_name: "Ana Silva" },
    { student_id: "s002", display_name: "Bruno Costa" },
    { student_id: "s003", display_name: "Carla Mendes" },
    { student_id: "s004", display_name: "Diego Rocha" },
    { student_id: "s005", display_name: "Elisa Nunes" }
  ],

  challenge: {
    challenge_id: "paradigms-2026-001",
    version: 1,
    title: "Imperative clues in a small program",
    topics: ["imperative", "state", "iteration"],
    difficulty: "introductory",

    intro: [
      {
        type: "markdown",
        content: "Today’s challenge is about recognizing clues of imperative programming."
      }
    ],

    prompt: [
      {
        type: "markdown",
        content: "Consider the following JavaScript fragment:"
      },
      {
        type: "code",
        language: "javascript",
        content: "let total = 0;\nfor (const x of numbers) {\n  total += x;\n}"
      },
      {
        type: "callout",
        style: "reflection",
        content: "Focus on what changes during execution and how the computation is described."
      },
      {
        type: "question",
        content: "Which programming paradigm is most visible here? Explain your reasoning using evidence from the code."
      }
    ],

    response: {
      type: "mixed",
      fields: [
        {
          id: "choice",
          type: "single_choice",
          label: "Which paradigm is most visible?",
          required: true,
          options: [
            { id: "imperative", label: "Imperative" },
            { id: "functional", label: "Functional" },
            { id: "logic", label: "Logic" },
            { id: "object_oriented", label: "Object-oriented" }
          ]
        },
        {
          id: "explanation",
          type: "open_text",
          label: "Explain your reasoning",
          required: true,
          min_length: 30,
          placeholder: "Mention concrete clues from the code..."
        }
      ]
    }
  },

  mockFeedback: {
    messages: [
      "Correct. The fragment is mostly imperative because it uses mutable state and explicit iteration.",
      "Good: your explanation should mention state changes, assignment, or the loop structure."
    ],
    after_submission: [
      {
        type: "markdown",
        content: "One possible interpretation is that the fragment is mostly imperative because it updates a variable step by step."
      },
      {
        type: "code",
        language: "javascript",
        content: "const total = numbers.reduce((acc, x) => acc + x, 0);"
      },
      {
        type: "markdown",
        content: "The second version is closer to a functional style because it expresses the computation as a transformation instead of a sequence of mutations."
      }
    ]
  }
};