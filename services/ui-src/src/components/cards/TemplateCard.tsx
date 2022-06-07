/* eslint-disable */
import { S3 } from "aws-sdk";
// import { Storage } from "aws-amplify";
// components
import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card, Icon, TemplateCardAccordion } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";
// assets
import spreadsheetIcon from "../../assets/images/icon_spreadsheet.png";
// import temporaryExcelTemplate from "../../assets/templates/MCPARDummy.xls";
// import { errorHandler } from "utils/errors/errorHandler";

// inside your template or JSX code. Note <a download> doesn't work here because it is not same origin

// const downloadTemplate = (templateName: string) => {
// const s3 = new S3();
// const fileName = templateName + "xls";
// try {
//   s3.getObject({
//     Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME!,
//     Key: fileName,
//   });
// } catch (error: any) {
//   errorHandler("Failed to retrieve an object: " + error);
// }
// const link = document.createElement("a");
// link.setAttribute("target", "_blank");
// link.setAttribute("href", temporaryExcelTemplate);
// link.setAttribute("download", `Dummy.xls`);
// link.click();
// link.remove();
// };

// const downloadBlob = (blob: any, fileName: string) => {
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = fileName;
//   const clickHandler = () => {
//     setTimeout(() => {
//       URL.revokeObjectURL(url);
//       a.removeEventListener("click", clickHandler);
//     }, 150);
//   };
//   a.addEventListener("click", clickHandler, false);
//   a.click();
//   return a;
// };

export const TemplateCard = ({
  templateName,
  verbiage,
  cardprops,
  ...props
}: Props) => {
  const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  // get the signed URL string
  // const signedURL = async () => {
  //   return await Storage.get(templateName);
  // };

  // usage
  // const download = async () => {
  //   const result = await Storage.get(templateName, { download: true });
  //   downloadBlob(result.Body, fileName);
  // };

  const fileName = templateName + "xls";

  console.log(
    "process.env.S3_ATTACHMENTS_BUCKET_NAME",
    process.env.S3_ATTACHMENTS_BUCKET_NAME
  );

  const s3 = new S3();
  console.log(
    "bucket list",
    s3.listObjects({
      Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME!,
    })
  );

  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME!,
    Key: fileName,
  });

  console.log("signed url", url);

  return (
    <Card {...cardprops}>
      <Flex sx={sx.root} className={mqClasses} {...props}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex}>
          <Text sx={sx.cardTitleText}>{verbiage.title}</Text>
          {!isDesktop && <Text>{verbiage.dueDate}</Text>}
          <Text>{verbiage.body}</Text>
          {isDesktop && verbiage.note && <Text>{verbiage.note}</Text>}
          <Link href={url} isExternal>
            <Button
              sx={sx.templateDownloadButton}
              leftIcon={<Icon icon="downloadArrow" boxSize="1.5rem" />}
              // onClick={download}
              data-testid="template-download-button"
            >
              Download Excel Template
            </Button>
          </Link>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  templateName: string;
  verbiage: JsonObject;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginRight: "2rem",
    boxSize: "5.5rem",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "0.5rem",
    fontSize: "lg",
    fontWeight: "bold",
  },
  templateDownloadButton: {
    maxW: "16.5rem",
    justifyContent: "start",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    background: "palette.main",
    fontWeight: "bold",
    color: "palette.white",
    span: {
      marginLeft: "-0.25rem",
      marginRight: "0.25rem",
    },
    _hover: {
      background: "palette.main_darker",
    },
  },
};
