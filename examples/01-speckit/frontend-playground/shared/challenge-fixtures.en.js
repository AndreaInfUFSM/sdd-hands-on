export const challengeFixtures = [
  {
    id: "java-reference-vs-object",
    label: "References vs objects",
    challenge: {
      challenge_id: "java-oop-2026-001",
      version: 1,
      title: "Reference or object?",
      topics: ["Java", "objects", "references"],
      difficulty: "introductory",

      intro: [
        {
          type: "markdown",
          content: "A common confusion in Java is treating variables and objects as if they were the same thing."
        }
      ],

      prompt: [
        {
          type: "code",
          language: "java",
          content:
`class Box {
  private int value;

  public int getValue() {
    return this.value;
  }

  public void setValue(int value) {
    this.value = value;
  }

  public Box(int value) {
    this.value = value;
  }
}

public class Main {
  public static void main(String[] args) {
    Box a = new Box(10);
    Box b = a;
    b.setValue(20);

    System.out.println(a.getValue());
  }
}`
        },
        {
          type: "question",
          content: "What is printed, and why?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Choose the best answer",
            required: true,
            options: [
              {
                id: "a",
                label: "10, because changing b does not affect a."
              },
              {
                id: "b",
                label: "20, because a and b refer to the same object."
              },
              {
                id: "c",
                label: "Compilation error, because two variables cannot refer to the same object."
              },
              {
                id: "d",
                label: "Runtime error, because b was not created with new."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explain your reasoning",
            required: true,
            min_length: 30,
            placeholder: "Explain the difference between the variable and the object..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Correct answer: B. The variable b receives a copy of the reference stored in a, so both variables refer to the same Box object.",
        "The object is not duplicated by the assignment b = a. Java copies the reference, not the object itself."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "A useful mental model: variables of object types hold references. The object lives elsewhere, and more than one variable can refer to it."
        }
      ]
    }
  },

  {
    id: "java-static-vs-instance",
    label: "Static vs instance",
    challenge: {
      challenge_id: "java-oop-2026-002",
      version: 1,
      title: "One counter or many counters?",
      topics: ["Java", "static", "instance attributes"],
      difficulty: "introductory",

      intro: [
        {
          type: "markdown",
          content: "Another classic Java trap is confusing attributes that belong to each object with attributes that belong to the class."
        }
      ],

      prompt: [
        {
          type: "code",
          language: "java",
          content:
`class Student {
  String name;
  static int count = 0;

  Student(String name) {
    this.name = name;
    count++;
  }
}

Student s1 = new Student("Ana");
Student s2 = new Student("Bruno");

System.out.println(s1.count);
System.out.println(s2.count);`
        },
        {
          type: "question",
          content: "What is printed?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Choose the best answer",
            required: true,
            options: [
              {
                id: "a",
                label: "1 and 1, because each object has its own count."
              },
              {
                id: "b",
                label: "1 and 2, because s1 was created before s2."
              },
              {
                id: "c",
                label: "2 and 2, because count is static and shared by all Student objects."
              },
              {
                id: "d",
                label: "Compilation error, because static attributes cannot be accessed through objects."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explain your reasoning",
            required: true,
            min_length: 30,
            placeholder: "Explain what static means in this example..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Correct answer: C. The attribute count is static, so it belongs to the class Student, not to each individual Student object.",
        "Accessing a static attribute through an object reference is allowed by Java, but it is usually discouraged because it hides the fact that the value is shared."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "A clearer style would be `Student.count`, because it makes the class-level nature of the attribute visible."
        }
      ]
    }
  },

  {
    id: "java-constructor-default",
    label: "Default constructor",
    challenge: {
      challenge_id: "java-oop-2026-003",
      version: 1,
      title: "Where did the default constructor go?",
      topics: ["Java", "constructors", "object creation"],
      difficulty: "introductory",

      intro: [
        {
          type: "markdown",
          content: "Students often learn that Java provides a default constructor, but the small print matters. Naturally, the small print is where the quiz lives."
        }
      ],

      prompt: [
        {
          type: "code",
          language: "java",
          content:
`class Book {
  String title;

  Book(String title) {
    this.title = title;
  }
}

Book b = new Book();`
        },
        {
          type: "question",
          content: "What happens with this code?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Choose the best answer",
            required: true,
            options: [
              {
                id: "a",
                label: "It works, because Java always creates a default constructor."
              },
              {
                id: "b",
                label: "It works, and title receives null."
              },
              {
                id: "c",
                label: "It does not compile, because Book has no no-argument constructor."
              },
              {
                id: "d",
                label: "It compiles, but fails at runtime."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explain your reasoning",
            required: true,
            min_length: 30,
            placeholder: "Explain when Java creates a default constructor..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Correct answer: C. Java only provides a default no-argument constructor when the class declares no constructors at all.",
        "Since Book declares `Book(String title)`, the compiler does not automatically create `Book()`."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "To allow `new Book()`, the class would need an explicit no-argument constructor."
        },
        {
          type: "code",
          language: "java",
          content:
`Book() {
  this.title = "Untitled";
}`
        }
      ]
    }
  },

  {
    id: "oop-inheritance-vs-composition",
    label: "Inheritance misuse",
    challenge: {
      challenge_id: "java-oop-2026-004",
      version: 1,
      title: "Should this be inheritance?",
      topics: ["OOP", "inheritance", "composition"],
      difficulty: "intermediate",

      intro: [
        {
          type: "markdown",
          content: "Inheritance is often overused by beginners. If one class merely uses another, that does not automatically mean it should inherit from it. Shocking news from the kingdom of common sense."
        }
      ],

      prompt: [
        {
          type: "code",
          language: "java",
          content:
`class DatabaseConnection {
  void connect() {
    System.out.println("Connected");
  }
}

class ReportGenerator extends DatabaseConnection {
  void generateReport() {
    connect();
    System.out.println("Report generated");
  }
}`
        },
        {
          type: "question",
          content: "What is the main design problem with this use of inheritance?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Choose the best answer",
            required: true,
            options: [
              {
                id: "a",
                label: "There is no problem. Inheritance should be used whenever one class needs methods from another."
              },
              {
                id: "b",
                label: "ReportGenerator should probably have a DatabaseConnection instead of being one."
              },
              {
                id: "c",
                label: "The problem is that connect() does not return a String."
              },
              {
                id: "d",
                label: "The code cannot compile because Java does not support inheritance."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explain your reasoning",
            required: true,
            min_length: 40,
            placeholder: "Use the idea of 'is-a' versus 'has-a'..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Correct answer: B. A ReportGenerator is not a DatabaseConnection. It probably uses or has a DatabaseConnection.",
        "This is a typical case where composition is more appropriate than inheritance."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "A better design would give ReportGenerator a field of type DatabaseConnection and call it when needed."
        },
        {
          type: "code",
          language: "java",
          content:
`class ReportGenerator {
  private DatabaseConnection connection;

  ReportGenerator(DatabaseConnection connection) {
    this.connection = connection;
  }

  void generateReport() {
    connection.connect();
    System.out.println("Report generated");
  }
}`
        }
      ]
    }
  },

  {
    id: "java-thread-start-vs-run",
    label: "Thread start vs run",
    challenge: {
      challenge_id: "java-oop-2026-005",
      version: 1,
      title: "Thread or just a method call?",
      topics: ["Java", "threads", "concurrency"],
      difficulty: "intermediate",

      intro: [
        {
          type: "markdown",
          content: "In Java, creating a Thread object is not the same as starting a new thread of execution. Yes, the method names are trying to trick everyone. Very considerate."
        }
      ],

      prompt: [
        {
          type: "code",
          language: "java",
          content:
`Thread t = new Thread(() -> {
  System.out.println("Running");
});

t.run();

System.out.println("Done");`
        },
        {
          type: "question",
          content: "What is the main issue with this code if the intention is to run concurrently?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Choose the best answer",
            required: true,
            options: [
              {
                id: "a",
                label: "`run()` starts a new thread, so the code is concurrent."
              },
              {
                id: "b",
                label: "`run()` is just a normal method call here; `start()` is needed to create a new thread of execution."
              },
              {
                id: "c",
                label: "The code cannot compile because lambdas cannot be used with Thread."
              },
              {
                id: "d",
                label: "`System.out.println` cannot be used inside a thread."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explain your reasoning",
            required: true,
            min_length: 40,
            placeholder: "Explain the difference between run() and start()..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Correct answer: B. Calling `run()` directly does not start a new thread. It executes the method in the current thread.",
        "To start a new thread of execution, call `t.start()`. Then the JVM will invoke `run()` in the new thread."
      ],
      after_submission: [
        {
          type: "code",
          language: "java",
          content:
`Thread t = new Thread(() -> {
  System.out.println("Running");
});

t.start();

System.out.println("Done");`
        },
        {
          type: "markdown",
          content: "With `start()`, the exact order of the printed messages may vary because execution is concurrent."
        }
      ]
    }
  }
];