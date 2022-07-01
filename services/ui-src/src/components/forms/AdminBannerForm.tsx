import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { formFieldFactory } from "utils/forms/forms";
import { bannerId } from "../../constants";
import { REPLACE_BANNER_FAILED } from "verbiage/errors";
// data
import { form as formJson } from "data/forms/adminBannerForm";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();

  const onSubmit = async (formData: any) => {
    const newBannerData = {
      key: bannerId,
      title: formData.title,
      description: formData.description,
      link: formData.link,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    try {
      await writeAdminBanner(newBannerData);
      document.getElementById("AdminHeader")!.focus();
    } catch (error: any) {
      setError(REPLACE_BANNER_FAILED);
    }
    window.scrollTo(0, 0);
  };

  return (
    <Form formJson={formJson} onSubmit={onSubmit} {...props}>
      <ErrorAlert error={error} sxOverrides={sx.errorAlert} />
      {formFieldFactory(formJson.fields)}
      <Flex sx={sx.previewFlex}>
        <PreviewBanner />
        <Button
          type="submit"
          sx={sx.replaceBannerButton}
          colorScheme="colorSchemes.main"
        >
          Replace Current Banner
        </Button>
      </Flex>
    </Form>
  );
};

interface Props {
  writeAdminBanner: Function;
  [key: string]: any;
}

const sx = {
  errorAlert: {
    maxWidth: "40rem",
  },
  previewFlex: {
    flexDirection: "column",
  },
  replaceBannerButton: {
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};
