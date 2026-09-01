"use client";

import { useEffect } from "react";
import TagManager from "react-gtm-module";
import envConfig from "@/src/config";

export function GoogleTagManager() {
  useEffect(() => {
    if (envConfig.GTM) {
      TagManager.initialize({ gtmId: envConfig.GTM });
    }
    if (envConfig.GTM_2) {
      TagManager.initialize({ gtmId: envConfig.GTM_2 });
    }
  }, []);

  return null;
}
