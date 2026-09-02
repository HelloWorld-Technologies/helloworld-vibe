const config = () => ({
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  BASE_URL: process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL,
  PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  S3_IMAGE_BUCKET_BASE_URL:
    process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_BASE_URL ??
    "https://images.thehelloworld.com/",
  ENV: process.env.NEXT_PUBLIC_ENV,
  GTM: process.env.NEXT_PUBLIC_GTM,
  GTM_2: process.env.NEXT_PUBLIC_GTM_2,
  VERSION: "1.0.0",
});

export default config();
