const cityCampaignPrice = {
  bangalore: { private: 19000, sharing: 12000, "1bhk": "" },
  hyderabad: { private: 25000, sharing: 14000, "1bhk": "" },
  ncr: { private: 16000, sharing: 9000, "1bhk": "" },
  kota: { private: 15000, sharing: "", "1bhk": "" },
  indore: { private: 10000, sharing: "", "1bhk": "13000" },
  kolkata: { private: 14000, sharing: 9000, "1bhk": "" },
  mumbai: { private: 25000, sharing: 20000, "1bhk": "" },
  pune: { private: 13000, sharing: 6000, "1bhk": "" },
  coimbatore: { private: 11000, sharing: 6000, "1bhk": "" },
  noida: { private: 13000, sharing: 7000, "1bhk": "" },
  gurugram: { private: 23000, sharing: 17000, "1bhk": "" },
  chennai: { private: "", sharing: 10000, "1bhk": "" },
} as const;

export type CampaignCitySlug = keyof typeof cityCampaignPrice;

export const CAMPAIGN_CITY_SLUGS = Object.keys(
  cityCampaignPrice,
) as CampaignCitySlug[];

export default cityCampaignPrice;
