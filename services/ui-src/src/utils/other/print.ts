import { getRequestHeaders } from "utils";
import { API } from "aws-amplify";
import config from "config";

export const printPdf = async () => {
  const noscriptTag = document.querySelector("noscript");
  if (noscriptTag) {
    noscriptTag.remove();
  }
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
  openPdf(response);
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
