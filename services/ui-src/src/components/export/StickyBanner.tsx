// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// verbiage
import verbiage from "verbiage/pages/exportedReport";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

import { getRequestHeaders } from "utils";
import { API } from "aws-amplify";
import config from "config";
import { Buffer } from "buffer";

export const StickyBanner = () => {
  const { banner } = verbiage;
  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>{banner.heading}</Text>
      <Button sx={sx.pdfButton} onClick={printReport}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        {banner.buttonCopy}
      </Button>
    </Box>
  );
};

const printReport = async () => {
  const noscriptTag = document.querySelector("noscript");
  if (noscriptTag) {
    noscriptTag.remove();
  }
  document.querySelectorAll("input").forEach((element) => {
    if (element.type === "text") {
      element.style.height = "50px";
    }
  });
  document.querySelectorAll("button").forEach((element) => {
    if (element.title !== "Print") {
      element.remove();
    }
  });
  const htmlString = document!
    .querySelector("html")!
    .outerHTML.replaceAll(
      '<link href="',
      `<link href="https://${window.location.host}`
    )
    .replaceAll(`’`, `'`)
    .replaceAll(`‘`, `'`)
    .replaceAll(`”`, `"`)
    .replaceAll(`“`, `"`)
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-");
  const base64String = btoa(unescape(encodeURIComponent(htmlString)));
  // const base64String = Buffer.from(
  //   decodeURI(encodeURIComponent(htmlString))
  // ).toString("base64");

  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { encodedHtml: base64String },
  };
  let response;
  if (config.DEV_API_URL) {
    response = await API.post("mcrDev", `/print_pdf`, request);
  } else {
    response = await API.post("reports", `/print_pdf`, request);
  }
  console.log(response);
  openPdf(response);
  return response;
};

const openPdf = (basePdf: string) => {
  let byteCharacters = atob(basePdf);
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let file = new Blob([byteArray], { type: "application/pdf;base64" });
  let fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};

const sx = {
  container: {
    position: "sticky",
    top: "11.125rem",
    margin: "2rem 0",
    padding: "3rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",

    ".mobile &": {
      padding: "2rem 1rem",
    },
    p: {
      marginBottom: "1rem",
      fontSize: "xl",
      fontWeight: "bold",
      ".mobile &": {
        fontSize: "lg",
      },
    },
  },
  pdfButton: {
    img: {
      marginRight: "0.5rem",
    },
  },
};
