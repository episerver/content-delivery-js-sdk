export function parsePreviewToken(url) {
  var absolute = new URL(url, "http://temp");

  const previewToken = absolute.searchParams.get("preview_token");
  absolute.searchParams.delete("preview_token");

  return {
    url: absolute.host === "temp" ? absolute.pathname + absolute.search : absolute.href,
    previewToken: previewToken,
  };
}
