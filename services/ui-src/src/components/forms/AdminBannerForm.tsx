import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
// data
import formJson from "forms/internal/abf/abf.json";
import formSchema from "forms/internal/abf/abf.schema";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();

  const onSubmit = async (formData: any) => {
    const newBannerData = {
      key: bannerId,
      title: formData["abf-title"],
      description: formData["abf-description"],
      link: formData["abf-link"],
      startDate: convertDatetimeStringToNumber(
        formData["abf-startDate"],
        "startDate"
      ),
      endDate: convertDatetimeStringToNumber(
        formData["abf-endDate"],
        "endDate"
      ),
    };
    try {
      await writeAdminBanner(newBannerData);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
    }
  };

  return (
    <>
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <Form
        id={formJson.id}
        formJson={formJson}
        formSchema={formSchema}
        onSubmit={onSubmit}
        {...props}
      >
        <PreviewBanner />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button form={formJson.id} type="submit" sx={sx.replaceBannerButton}>
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
