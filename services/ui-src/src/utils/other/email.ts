export const createEmailLink = (emailData: Props): string => {
  const { address, subject } = emailData;
  const mailtoSubject = subject ? `?${encodeURIComponent(subject)}` : "";

  return `mailto:${address}${mailtoSubject}`;
};

interface Props {
  address: string;
  subject?: string;
}
