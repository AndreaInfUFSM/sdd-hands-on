export const challengeFixtures = [
  {
    id: "java-reference-vs-object",
    label: "Referências vs objetos",
    challenge: {
      challenge_id: "java-oop-2026-001",
      version: 1,
      title: "Referência ou objeto?",
      topics: ["Java", "objetos", "referências"],
      difficulty: "introdutório",

      intro: [
        {
          type: "markdown",
          content: "Uma confusão comum em Java é tratar variáveis e objetos como se fossem a mesma coisa."
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
          content: "O que é impresso e por quê?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Escolha a melhor resposta",
            required: true,
            options: [
              {
                id: "a",
                label: "10, porque alterar b não afeta a."
              },
              {
                id: "b",
                label: "20, porque a e b fazem referência ao mesmo objeto."
              },
              {
                id: "c",
                label: "Erro de compilação, porque duas variáveis não podem fazer referência ao mesmo objeto."
              },
              {
                id: "d",
                label: "Erro em tempo de execução, porque b não foi criado com new."
              }
            ],
            correct_option_id: "b"
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explique seu raciocínio",
            required: true,
            min_length: 30,
            placeholder: "Explique a diferença entre a variável e o objeto..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Resposta correta: B. A variável b recebe uma cópia da referência armazenada em a, então as duas variáveis fazem referência ao mesmo objeto Box.",
        "O objeto não é duplicado pela atribuição b = a. Java copia a referência, não o objeto em si."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "Um modelo mental útil: variáveis de tipos de objeto armazenam referências. O objeto vive em outro lugar, e mais de uma variável pode fazer referência a ele."
        }
      ]
    }
  },

  {
    id: "java-static-vs-instance",
    label: "Estático vs instância",
    challenge: {
      challenge_id: "java-oop-2026-002",
      version: 1,
      title: "Um contador ou vários contadores?",
      topics: ["Java", "static", "atributos de instância"],
      difficulty: "introdutório",

      intro: [
        {
          type: "markdown",
          content: "Outra armadilha clássica em Java é confundir atributos que pertencem a cada objeto com atributos que pertencem à classe."
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
          content: "O que é impresso?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Escolha a melhor resposta",
            required: true,
            options: [
              {
                id: "a",
                label: "1 e 1, porque cada objeto tem seu próprio count."
              },
              {
                id: "b",
                label: "1 e 2, porque s1 foi criado antes de s2."
              },
              {
                id: "c",
                label: "2 e 2, porque count é static e compartilhado por todos os objetos Student."
              },
              {
                id: "d",
                label: "Erro de compilação, porque atributos static não podem ser acessados por meio de objetos."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explique seu raciocínio",
            required: true,
            min_length: 30,
            placeholder: "Explique o que static significa neste exemplo..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Resposta correta: C. O atributo count é static, então pertence à classe Student, não a cada objeto Student individual.",
        "Acessar um atributo static por meio de uma referência de objeto é permitido em Java, mas geralmente é desencorajado porque esconde o fato de que o valor é compartilhado."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "Um estilo mais claro seria usar `Student.count`, porque isso torna visível a natureza do atributo como pertencente à classe."
        }
      ]
    }
  },

  {
    id: "java-constructor-default",
    label: "Construtor padrão",
    challenge: {
      challenge_id: "java-oop-2026-003",
      version: 1,
      title: "Para onde foi o construtor padrão?",
      topics: ["Java", "construtores", "criação de objetos"],
      difficulty: "introdutório",

      intro: [
        {
          type: "markdown",
          content: "Estudantes frequentemente aprendem que Java fornece um construtor padrão, mas os detalhes importam. Naturalmente, é nos detalhes que a questão mora."
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
          content: "O que acontece com este código?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Escolha a melhor resposta",
            required: true,
            options: [
              {
                id: "a",
                label: "Funciona, porque Java sempre cria um construtor padrão."
              },
              {
                id: "b",
                label: "Funciona, e title recebe null."
              },
              {
                id: "c",
                label: "Não compila, porque Book não tem um construtor sem argumentos."
              },
              {
                id: "d",
                label: "Compila, mas falha em tempo de execução."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explique seu raciocínio",
            required: true,
            min_length: 30,
            placeholder: "Explique quando Java cria um construtor padrão..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Resposta correta: C. Java só fornece um construtor padrão sem argumentos quando a classe não declara nenhum construtor.",
        "Como Book declara `Book(String title)`, o compilador não cria automaticamente `Book()`."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "Para permitir `new Book()`, a classe precisaria de um construtor sem argumentos explícito."
        },
        {
          type: "code",
          language: "java",
          content:
`Book() {
  this.title = "Sem título";
}`
        }
      ]
    }
  },

  {
    id: "oop-inheritance-vs-composition",
    label: "Uso inadequado de herança",
    challenge: {
      challenge_id: "java-oop-2026-004",
      version: 1,
      title: "Isto deveria ser herança?",
      topics: ["POO", "herança", "composição"],
      difficulty: "intermediário",

      intro: [
        {
          type: "markdown",
          content: "Herança é frequentemente usada em excesso por iniciantes. Se uma classe apenas usa outra, isso não significa automaticamente que ela deve herdar dela. Notícia chocante vinda do reino do bom senso."
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
          content: "Qual é o principal problema de projeto neste uso de herança?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Escolha a melhor resposta",
            required: true,
            options: [
              {
                id: "a",
                label: "Não há problema. Herança deve ser usada sempre que uma classe precisa de métodos de outra."
              },
              {
                id: "b",
                label: "ReportGenerator provavelmente deveria ter uma DatabaseConnection, em vez de ser uma."
              },
              {
                id: "c",
                label: "O problema é que connect() não retorna uma String."
              },
              {
                id: "d",
                label: "O código não compila porque Java não suporta herança."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explique seu raciocínio",
            required: true,
            min_length: 40,
            placeholder: "Use a ideia de 'é um' versus 'tem um'..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Resposta correta: B. Um ReportGenerator não é uma DatabaseConnection. Ele provavelmente usa ou tem uma DatabaseConnection.",
        "Este é um caso típico em que composição é mais apropriada do que herança."
      ],
      after_submission: [
        {
          type: "markdown",
          content: "Um projeto melhor daria a ReportGenerator um campo do tipo DatabaseConnection e o chamaria quando necessário."
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
      title: "Thread ou apenas chamada de método?",
      topics: ["Java", "threads", "concorrência"],
      difficulty: "intermediário",

      intro: [
        {
          type: "markdown",
          content: "Em Java, criar um objeto Thread não é o mesmo que iniciar uma nova thread de execução. Sim, os nomes dos métodos parecem tentar enganar todo mundo. Muito atencioso da parte deles."
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
          content: "Qual é o principal problema deste código se a intenção é executar de forma concorrente?"
        }
      ],

      response: {
        type: "mixed",
        fields: [
          {
            id: "choice",
            type: "single_choice",
            label: "Escolha a melhor resposta",
            required: true,
            options: [
              {
                id: "a",
                label: "`run()` inicia uma nova thread, então o código é concorrente."
              },
              {
                id: "b",
                label: "`run()` é apenas uma chamada normal de método neste caso; `start()` é necessário para criar uma nova thread de execução."
              },
              {
                id: "c",
                label: "O código não compila porque lambdas não podem ser usadas com Thread."
              },
              {
                id: "d",
                label: "`System.out.println` não pode ser usado dentro de uma thread."
              }
            ]
          },
          {
            id: "explanation",
            type: "open_text",
            label: "Explique seu raciocínio",
            required: true,
            min_length: 40,
            placeholder: "Explique a diferença entre run() e start()..."
          }
        ]
      }
    },

    feedback: {
      messages: [
        "Resposta correta: B. Chamar `run()` diretamente não inicia uma nova thread. Isso executa o método na thread atual.",
        "Para iniciar uma nova thread de execução, chame `t.start()`. Então a JVM invocará `run()` na nova thread."
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
          content: "Com `start()`, a ordem exata das mensagens impressas pode variar porque a execução é concorrente."
        }
      ]
    }
  }
];