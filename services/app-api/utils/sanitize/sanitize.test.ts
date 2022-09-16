import { sanitizeArray, sanitizeObject, sanitizeString } from "./index";

test("Sanitize String should remove code injection from string", () => {
  const string = '<img id="img1" src="foo.png" onload="alert("Hello!")" />';
  expect(sanitizeString(string)).toEqual('<img src="foo.png" id="img1">');
});

test("Sanitize String should remove code injection from strings in objects", () => {
  const object = {
    string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
    array: [
      "test",
      '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
      "<svg><g/onload=alert(2)//<p>",
    ],
    object: {
      string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
      array: [
        "<UL><li><A HREF=//google.com>click</UL>",
        "test2",
        "<svg><g/onload=alert(2)//<p>",
      ],
    },
  };

  expect(sanitizeObject(object)).toEqual({
    string: '<img src="foo.png" id="img1">',
    array: ["test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
    object: {
      string: '<img src="foo.png" id="img1">',
      array: [
        '<ul><li><a href="//google.com">click</a></li></ul>',
        "test2",
        "<svg><g></g></svg>",
      ],
    },
  });
});

test("Sanitize String should remove code injection from strings in arrays", () => {
  const array = [
    {
      string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
      array: [
        "test",
        '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
        "<svg><g/onload=alert(2)//<p>",
      ],
      object: {
        string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
        array: [
          "<UL><li><A HREF=//google.com>click</UL>",
          "test2",
          "<svg><g/onload=alert(2)//<p>",
        ],
      },
    },
    {
      string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
      array: [
        "test",
        '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
        "<svg><g/onload=alert(2)//<p>",
      ],
      object: {
        string: '<img id="img1" src="foo.png" onload="alert("Hello!")" />',
        array: [
          "<UL><li><A HREF=//google.com>click</UL>",
          "test2",
          "<svg><g/onload=alert(2)//<p>",
        ],
      },
    },
  ];

  expect(sanitizeArray(array)).toEqual([
    {
      string: '<img src="foo.png" id="img1">',
      array: ["test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
      object: {
        string: '<img src="foo.png" id="img1">',
        array: [
          '<ul><li><a href="//google.com">click</a></li></ul>',
          "test2",
          "<svg><g></g></svg>",
        ],
      },
    },
    {
      string: '<img src="foo.png" id="img1">',
      array: ["test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
      object: {
        string: '<img src="foo.png" id="img1">',
        array: [
          '<ul><li><a href="//google.com">click</a></li></ul>',
          "test2",
          "<svg><g></g></svg>",
        ],
      },
    },
  ]);
});
