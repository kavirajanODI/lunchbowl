import React from "react";
import { DefaultSeo as NextSeo } from "next-seo";

//internal import
import useGetSetting from "@hooks/useGetSetting";

const DefaultSeo = () => {
  const { globalSetting } = useGetSetting();

  return (
    <NextSeo
      title={
        globalSetting?.meta_title ||
        "lunchBowl - Healthy Bites to Fuel Your Child’s Mind"
      }
      openGraph={{
        type: "website",
        locale: "en_IE",
        url: globalSetting?.meta_url || "https://lunchBowl-store.vercel.app/",
        site_name:
          globalSetting?.meta_title ||
          "lunchBowl - Healthy Bites to Fuel Your Child’s Mind",
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "viewport",
          content:
            "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "apple-touch-icon",
          href: "/icon-192x192.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
};

export default DefaultSeo;
