import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId, REPLACE_BANNER_FAILED } from "utils/constants/constants";
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
    <>
      <ErrorAlert error={error} sxOverrides={sx.errorAlert} />
      <Form id={formJson.id} formJson={formJson} onSubmit={onSubmit} {...props}>
        <PreviewBanner />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button
          form={formJson.id}
          type="submit"
          sx={sx.replaceBannerButton}
          colorScheme="colorSchemes.main"
        >
          Replace Current Banner
        </Button>
      </Flex>
    </>
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
