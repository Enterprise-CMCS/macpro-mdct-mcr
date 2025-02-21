import { useState } from "react";
import uuid from "react-uuid";
// components
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// types
import { AlertTypes, ErrorVerbiage, FormJson } from "types";
// utils
import { convertDatetimeStringToNumber } from "utils";
// verbiage
import { bannerErrors } from "verbiage/errors";
// form
import formJson from "forms/addAdminBanner/addAdminBanner.json";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<ErrorVerbiage>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = async (formData: any) => {
    setSubmitting(true);
    const newBannerData = {
      key: uuid(),
      title: formData["bannerTitle"],
      description: formData["bannerDescription"],
      link: formData["bannerLink"] || undefined,
      startDate: convertDatetimeStringToNumber(
        formData["bannerStartDate"],
        "startDate"
      ),
      endDate: convertDatetimeStringToNumber(
        formData["bannerEndDate"],
        "endDate"
      ),
    };
    try {
      await writeAdminBanner(newBannerData);
      window.scrollTo(0, 0);
    } catch {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        validateOnRender={false}
        dontReset={false}
        {...props}
      >
        <PreviewBanner status={AlertTypes.INFO} />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button form={form.id} type="submit" sx={sx.replaceBannerButton}>
          {submitting ? <Spinner size="md" /> : "Create banner"}
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
    width: "10rem",
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};
