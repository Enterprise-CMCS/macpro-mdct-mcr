import { parseCustomHtml } from "./parsing";

export const labelTextWithOptional = (label: any) =>
  parseCustomHtml(label + "<span class='optional-text'> (optional)</span>");
