/* eslint-disable no-console */
import data from "./numberFieldResults.json";

const patterns: { name: string; regex: RegExp; count?: number }[] = [
  {
    name: "Digits only",
    regex: /^\d+$/,
  },
  {
    name: "Digits with decimal",
    regex: /^\d+\.\d+$/,
  },
  {
    name: "Ratio with digits only",
    regex: /^\d+:\d+$/,
  },
  {
    name: "Digits with commas",
    regex: /^\d{1,3}(,\d{3})+$/,
  },
  {
    name: "Digits with commas and decimal",
    regex: /^\d{1,3}(,\d{3})+\.\d+$/,
  },
  {
    name: "N/A",
    regex: /^N\/A$/,
  },
  {
    name: "Data not available",
    regex: /^Data not available$/,
  },
  {
    name: "Ratio with commas",
    regex: /^\d{1,3}(,\d{3})*:\d{1,3}(,\d{3})*$/,
  },
  {
    name: "Dollar with digits only",
    regex: /^\$\d+$/,
  },
  {
    name: "Dollar with digits and commas",
    regex: /^\$\d{1,3}(,\d{3})+$/,
  },
  {
    name: "Dollar with digits and decimal",
    regex: /^\$\d+\.\d+$/,
  },
  {
    name: "Dollar with digits, commas, and decimals",
    regex: /^\$\d{1,3}(,\d{3})+\.\d+$/,
  },
  {
    name: "Dollar with digits, commas, decimals, and surrounding whitespace",
    regex: /^\s*\$\d{1,3}(,\d{3})+\.\d+\s*$/,
  },
  {
    name: "Percent with digits only",
    regex: /^\d+%$/,
  },
  {
    name: "Percent with digits and commas",
    regex: /^\d{1,3}(,\d{3})+%$/,
  },
  {
    name: "Percent with digits and decimals",
    regex: /^\d+\.\d+%$/,
  },
  {
    name: "Negative with digits only",
    regex: /^-\d+$/,
  },
  {
    name: "Negative with digits and commas",
    regex: /^-\d{1,3}(,\d{3})+$/,
  },
  {
    name: "Ratio with decimals, and possibly no leading digit, and maybe some whitespace",
    regex: /^\d*(\.\d+)?\s*:\s*\d*(\.\d+)?\s*$/,
  },
  {
    name: "Another ratio but it's fine",
    regex: /^\d*(\.\d+)?:\d{1,3}(,\d{3})*\s*$/,
  },
  {
    name: "Number with commas and surrounding whitespace",
    regex: /^\s*\d{1,3}(,\d{3})*\s*$/,
  },
  {
    name: "Decimal with no leading digit",
    regex: /^\.\d+$/,
  },
];

let oddballs = [];
for (let [reportType, fieldList] of Object.entries(data)) {
  for (let field of fieldList) {
    const pattern = patterns.find(({ regex }) => regex.test(field.value));
    if (!pattern) {
      oddballs.push({ reportType, ...field });
    } else {
      pattern.count = 1 + (pattern.count ?? 0);
    }
  }
}

const resultTable = [
  ["value count", "simplest matched pattern"],
  ["════════════╪═════════════════════════"],
]
  .concat(
    patterns.map((p) =>
      [p.count ?? 0, p.name].map((cell) => cell.toString().padStart(11, " "))
    )
  )
  .map((row) => row.join(" │ "))
  .join("\n");
console.log(resultTable);
console.log(`${oddballs.length} fields not matching any known pattern:`);
console.log(oddballs.map((ob) => Object.values(ob).join(" ")).join("\n"));
