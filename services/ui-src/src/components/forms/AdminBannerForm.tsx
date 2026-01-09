import { useState } from "react";
// components
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// types
import { ErrorVerbiage, FormJson } from "types";
// utils
import {
  convertDateEtToUtc,
  convertDatetimeStringToNumber,
  useStore,
} from "utils";
// verbiage
import { bannerErrors } from "verbiage/errors";
// form
import formJson from "forms/addAdminBanner/addAdminBanner.json";

const dateOverlapErrorMessage = {
  title: "Banners cannot have overlapping dates.",
  description: "Please adjust the new banner dates and try again.",
};

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<ErrorVerbiage>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { allBanners } = useStore();

  // add validation to formJson
  const form: FormJson = formJson;

  // ensure banner dates in form don't overlap with existing banners
  const newDatesOverlap = (formData: any) => {
    // exit if no existing banners
    if (!allBanners) return false;

    const desiredStartDate = convertDateEtToUtc(formData["bannerStartDate"]);
    const desiredEndDate = convertDateEtToUtc(formData["bannerEndDate"]);

    // go through each banner and see if the dates overlap
    for (const banner of allBanners) {
      const startDateOverlap =
        desiredStartDate > banner.startDate &&
        desiredStartDate < banner.endDate;
      const endDateOverlap =
        desiredEndDate > banner.startDate && desiredEndDate < banner.endDate;
      if (startDateOverlap || endDateOverlap) {
        setError(dateOverlapErrorMessage);
        return true;
      } else {
        setError(undefined);
      }
    }
    return false;
  };

  const onSubmit = async (formData: any) => {
    // do not submit if dates conflict
    if (newDatesOverlap(formData)) return;

    setSubmitting(true);
    const newBannerData = {
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
        <PreviewBanner />
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
