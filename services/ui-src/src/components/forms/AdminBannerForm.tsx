import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { REPLACE_BANNER_FAILED } from "verbiage/errors";
// data
import { form as formJson } from "verbiage/forms/adminBannerForm";
import { calculateTimeByDateType, convertDateEtToUtc } from "utils";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();

  const convertTime = (date: string, fieldName: string) => {
    const year = parseInt(date.split("/")?.[2]);
    const month = parseInt(date.split("/")?.[0]);
    const day = parseInt(date.split("/")?.[1]);
    let convertedTime = undefined;
    if (year && month && day) {
      const time = calculateTimeByDateType(fieldName);
      convertedTime = convertDateEtToUtc({ year, month, day }, time);
    }
    return convertedTime;
  };

  const onSubmit = async (formData: any) => {
    const newBannerData = {
      key: bannerId,
      title: formData["abf-title"],
      description: formData["abf-description"],
      link: formData["abf-link"],
      startDate: convertTime(formData["abf-startDate"], "abf-startDate"),
      endDate: convertTime(formData["abf-endDate"], "abf-endDate"),
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
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
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
