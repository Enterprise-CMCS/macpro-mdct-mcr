export const createEmailLink = (emailData: Props): string => {
  const { address, subject, body } = emailData;
  const mailtoSubject = subject ? `?${encodeURIComponent(subject)}` : "";
  const mailtoBody = body ? `&${encodeURIComponent(body)}` : "";

  return `mailto:${address}${mailtoSubject}${mailtoBody}`;
};

interface Props {
  address: string;
  subject?: string;
  body?: string;
}
