import { sanitizeArray, sanitizeObject, sanitizeString } from "./sanitize";
const string = '<img id="img1" src="foo.png" onload="alert("Hello!")" />';
const object = {
  string,
  numbers: 2349872,
  array: [
    234234,
    "test",
    '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
    "<svg><g/onload=alert(2)//<p>",
  ],
  object: {
    string,
    numbers: 2349872,
    array: [
      "<UL><li><A HREF=//google.com>click</UL>",
      "test2",
      234234,
      "<svg><g/onload=alert(2)//<p>",
    ],
    array2: [],
  },
};

const array = [object, object];
const arrays = [[object], ["<svg><g/onload=alert(2)//<p>", "test2"], []];

test("Should remove code injection from string", () => {
  expect(sanitizeString(string)).toEqual('<img src="foo.png" id="img1">');
});

test("Should remove code injection from strings in objects", () => {
  expect(sanitizeObject(object)).toEqual({
    string: '<img src="foo.png" id="img1">',
    numbers: 2349872,
    array: [234234, "test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
    object: {
      string: '<img src="foo.png" id="img1">',
      numbers: 2349872,
      array: [
        '<ul><li><a href="//google.com">click</a></li></ul>',
        "test2",
        234234,

        "<svg><g></g></svg>",
      ],
      array2: [],
    },
  });
  expect(sanitizeArray(array)).toEqual([
    {
      string: '<img src="foo.png" id="img1">',
      numbers: 2349872,
      array: [234234, "test", "<math><mi></mi></math>", "<svg><g></g></svg>"],

      object: {
        string: '<img src="foo.png" id="img1">',
        numbers: 2349872,
        array: [
          '<ul><li><a href="//google.com">click</a></li></ul>',
          "test2",
          234234,
          "<svg><g></g></svg>",
        ],
        array2: [],
      },
    },
    {
      string: '<img src="foo.png" id="img1">',
      numbers: 2349872,
      array: [234234, "test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
      object: {
        string: '<img src="foo.png" id="img1">',
        numbers: 2349872,
        array: [
          '<ul><li><a href="//google.com">click</a></li></ul>',
          "test2",
          234234,
          "<svg><g></g></svg>",
        ],
        array2: [],
      },
    },
  ]);
  expect(sanitizeArray(arrays)).toEqual([
    [
      {
        string: '<img src="foo.png" id="img1">',
        numbers: 2349872,
        array: [234234, "test", "<math><mi></mi></math>", "<svg><g></g></svg>"],
        object: {
          string: '<img src="foo.png" id="img1">',
          numbers: 2349872,
          array: [
            '<ul><li><a href="//google.com">click</a></li></ul>',
            "test2",
            234234,
            "<svg><g></g></svg>",
          ],
          array2: [],
        },
      },
    ],
    ["<svg><g></g></svg>", "test2"],
    [],
  ]);
  expect(sanitizeObject(null)).toEqual(null);
  expect(sanitizeArray([])).toEqual([]);
});
