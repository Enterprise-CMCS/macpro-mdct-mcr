import { useState } from "react";
// components
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { FormJson } from "types";
// data
import formJson from "forms/addAdminBanner/addAdminBanner.json";
import theme from "styles/theme";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = async (formData: any) => {
    setLoading(true);
    const newBannerData = {
      key: bannerId,
      title: formData["aab-title"],
      description: formData["aab-description"],
      link: formData["aab-link"] || undefined,
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
      setLoading(false);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
      setLoading(false);
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
          {loading ? (
            <Spinner size="sm" color={theme.colors.palette.white} />
          ) : (
            "Replace Current Banner"
          )}
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
