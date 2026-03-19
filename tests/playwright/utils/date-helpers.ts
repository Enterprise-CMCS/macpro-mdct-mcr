/**
 *
 * Returns a string formatted how the date field expects
 * @param date
 * @returns string in MM/DD/YYYY format
 */
export function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
