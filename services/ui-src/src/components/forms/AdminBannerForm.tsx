import { useState } from "react";
// components
import { Button, Flex } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { FormJson } from "types";
// data
import formJson from "forms/addAdminBanner/addAdminBanner.json";

export const AdminBannerForm = ({
  writeAdminBanner,
  reset,
  ...props
}: Props) => {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = async (formData: any) => {
    setSubmitting(true);
    const newBannerData = {
      key: bannerId,
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
    } catch (error: any) {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <Form id={form.id} formJson={form} onSubmit={onSubmit} {...props}>
        <PreviewBanner />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button
          form={form.id}
          type="submit"
          sx={sx.replaceBannerButton}
          onClick={() => {
            reset ? reset(false) : null;
          }}
        >
          {submitting ? <Spinner size="small" /> : "Replace Current Banner"}
        </Button>
      </Flex>
    </>
  );
};

interface Props {
  reset?: any;
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
    width: "14rem",
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};
