import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

const S3_IMAGE_BUCKET_BASE_URL =
  process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_BASE_URL ??
  "https://hw-production-compressed-image.s3.ap-south-1.amazonaws.com/";

function encodeImageUrl(url: string): string {
  return url.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20");
}

export function imageUrlFormatter(page: "srp" | "hdp", url: string): string {
  if (!url) return "";
  if (url.includes("coming-soon")) return srpCardComingSoonImage;

  let imgSrc = "";

  if (url.includes("http")) {
    imgSrc = url;
  } else if (process.env.NEXT_PUBLIC_ENV === "staging" || process.env.NEXT_PUBLIC_ENV === "dev") {
    imgSrc = "https://hw-staging-media.s3.ap-south-1.amazonaws.com/" + url;
  } else if (page === "srp") {
    imgSrc = `${S3_IMAGE_BUCKET_BASE_URL}${url.replace("original", "srp/desktop")}`;
  } else if (page === "hdp") {
    imgSrc = `${S3_IMAGE_BUCKET_BASE_URL}${url.replace("original", "hdp/desktop")}`;
  }

  return imgSrc ? encodeImageUrl(imgSrc) : imgSrc;
}

export function formatSrpCardImageSrc(url: string): string {
  if (!url) return "";
  if (url.includes("coming-soon")) return srpCardComingSoonImage;
  if (url.startsWith("/")) return url;
  if (url.includes("http")) return encodeImageUrl(url);
  return imageUrlFormatter("srp", url);
}
