import path from "path";

export const extractFilename = (url: string) => {
  const urlObject = new URL(url);
  return path.basename(urlObject.pathname);
};
