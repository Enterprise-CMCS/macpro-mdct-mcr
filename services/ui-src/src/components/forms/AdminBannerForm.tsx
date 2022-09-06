import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { FormJson } from "types";
// data
import formJson from "forms/addAdminBanner/addAdminBanner.json";
import formSchema from "forms/addAdminBanner/addAdminBanner.schema";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();

  // add validation to formJson
  const form: FormJson = formJson;
  form.validation = formSchema;

  const onSubmit = async (formData: any) => {
    const newBannerData = {
      key: bannerId,
      title: formData["aab-title"],
      description: formData["aab-description"],
      link: formData["aab-link"],
      startDate: convertDatetimeStringToNumber(
        formData["aab-startDate"],
        "startDate"
      ),
      endDate: convertDatetimeStringToNumber(
        formData["aab-endDate"],
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
      <Form id={form.id} formJson={form} onSubmit={onSubmit} {...props}>
        <PreviewBanner />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button form={form.id} type="submit" sx={sx.replaceBannerButton}>
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
