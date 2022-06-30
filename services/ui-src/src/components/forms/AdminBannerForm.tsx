import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Button, Flex } from "@chakra-ui/react";
import { Banner, ErrorAlert } from "../index";
// utils
import { bannerId, REPLACE_BANNER_FAILED } from "utils/constants/constants";
import { formFieldFactory } from "utils/forms/forms";
// data
import { form as formJson } from "../../data/forms/adminBannerForm";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();

  // make form context
  const form = useForm<any>({
    mode: formJson.options.mode as any,
    resolver: yupResolver(formJson.schema),
  });

  // submit new banner data via write method
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

  // set banner preview data
  const formData = form.getValues();
  const bannerPreviewData = {
    title: formData.title || "New banner title",
    description: formData.description || "New banner description",
    link: formData.link || "",
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <ErrorAlert error={error} sxOverrides={sx.errorAlert} />
        <React.Fragment children={formFieldFactory(formJson.fields)} />
        <Flex sx={sx.previewFlex}>
          <Banner bannerData={bannerPreviewData} />
          <Button
            type="submit"
            sx={sx.replaceBannerButton}
            colorScheme="colorSchemes.main"
          >
            Replace Current Banner
          </Button>
        </Flex>
      </form>
    </FormProvider>
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
