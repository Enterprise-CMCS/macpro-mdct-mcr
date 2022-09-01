import { object } from "yup";
import { date, endDate, textOptional } from "utils/forms/schemas";

export default object({
  "arp-a5a": date(),
  "arp-a5b": endDate("arp-a5a"),
  "arp-a6": textOptional(),
});
