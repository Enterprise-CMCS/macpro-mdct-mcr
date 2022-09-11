import { date, endDate, text, urlOptional } from "utils/validation/schemas";

export default {
  "aab-title": text(),
  "aab-description": text(),
  "aab-link": urlOptional(),
  "aab-startDate": date(),
  "aab-endDate": endDate("aab-startDate"),
};
