import { useFormContext } from "react-hook-form";
// components
import { Banner } from "components";

export const PreviewBanner = ({ ...props }: Props) => {
  // get the form context
  const form = useFormContext();

  // set banner preview data
  const formData = form.getValues();
  const bannerData = {
    title: formData["aab-title"] || "New banner title",
    description: formData["aab-description"] || "New banner description",
    link: formData["aab-link"] || "",
  };

  return <Banner bannerData={bannerData} {...props} />;
};

interface Props {
  [key: string]: any;
}
