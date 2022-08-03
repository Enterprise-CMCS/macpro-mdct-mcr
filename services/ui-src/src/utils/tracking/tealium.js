export const fireTealiumPageView = (
  user,
  url,
  contentType,
  sectionName,
  pathname
) => {
  const { host: siteDomain } = url ? new URL(url) : null;
  if (window.utag) {
    window.utag.view({
      content_language: "en",
      content_type: contentType,
      page_name: sectionName + ":" + pathname,
      page_path: pathname,
      site_domain: siteDomain,
      site_environment: process.env.NODE_ENV,
      site_section: sectionName,
      logged_in: !!user,
    });
  }
};
