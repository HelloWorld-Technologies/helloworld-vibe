import {
  fetchAllProperty,
  fetchCityLocalities,
  fetchNearbyPlaces,
  fetchPropertiesBySlug,
  SRP_LIST_PAGE_SIZE,
  type LocalityListItem,
} from "@/src/apis/srp";
import { getFaqsForSchema } from "@/src/constants/srp-faqs";
import { mergeKotaHostelSrpLocalities } from "@/src/constants/kota-srp-localities";
import PRESENT_CITIES from "@/src/constants/cities";
import {
  buildNearLandmarkHref,
  getNearLandmarkListLabel,
  getNearLandmarkSeo,
} from "@/src/lib/srp/near-landmark";
import {
  colivingCityKeyFromMarketingSlug,
  formatStartingSubtitle,
  getColivingCityMarketingSeoOverride,
  getFlatColivingLocalityMetaDescription,
  getFlatColivingLocalitySeo,
  getFlatGenderLocalityMetaDescription,
  getFlatGenderLocalityPageTitle,
  getKotaCityHostelsSeoOverride,
  getPropertiesListHeading,
  getSrpMetaDescription,
  getSrpPageDescription,
  getSrpPageTitle,
  localitySlugToName,
  minRentFromProperties,
} from "@/src/lib/srp/srp-seo";
import {
  genderFilterApiValue,
  parseFlatColivingLocalitySlug,
  parseFlatGenderLocalitySlug,
  parseFlatKotaGenderHostelSlug,
  parseFlatKotaGenericHostelSlug,
  parseFlatPgLocalitySlug,
  parseFlatRoomForRentLocalitySlug,
  parseMarketingSrpSlug,
  parseNearLandmarkSrpSlug,
} from "@/src/lib/srp-slug-parse";
import {
  createHdpSlug,
  getLocalitySlug,
  isKotaCity,
  srpSlug,
} from "@/src/lib/sitemap-slug";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getItemListSchema,
  getPublicSiteUrl,
  getWebPageSchema,
  type SrpPageSchema,
} from "@/src/lib/schema";
import { capitalizeFirstLetter } from "@/src/lib/string-utils";
import type { Property } from "@/src/models/property";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import type { LocalityBentoTile } from "@/src/tokens/locality";
import {
  localityAboutText,
  localityHeroImageSrc,
  localityStartingRent,
  mapLocalityBentoTiles,
  mapLocalityNearbyToDayFromHere,
} from "@/src/lib/srp/map-locality-info";
import type { LocalityInfo } from "@/src/models/locality-info";

export type SrpPageKind = "city" | "locality" | "landmark";

export type SrpBreadcrumbItem = { name: string; path?: string };

export type SrpRelatedLandmarkLink = { href: string; label: string };

export type SrpPageConfig = {
  kind: SrpPageKind;
  canonicalPath: string;
  livingType: "hostels" | "coliving";
  slugGender?: "male only" | "female only";
  city: string;
  localityName?: string;
  localitySlug?: string;
  landmarkSlug?: string;
  properties: Property[];
  total: number;
  pageTitle: string;
  pageMetaDescription: string;
  pageDescription: string;
  headerH1: string;
  propertiesHeading: string;
  heroSubtitle: string;
  heroImageSrc?: string;
  bentoTiles?: LocalityBentoTile[];
  dayFromHereItems?: NeighborhoodCardData[];
  aboutTitle: string;
  aboutText: string;
  breadcrumbItems: SrpBreadcrumbItem[];
  localityLinks: LocalityListItem[];
  relatedLandmarkLinks: SrpRelatedLandmarkLink[];
  faqs: { question: string; answer: string }[];
  schema: SrpPageSchema;
  hideFaqSection: boolean;
};

function buildPropertyItemList(
  baseUrl: string,
  srpSlugParam: string,
  city: string,
  properties: Property[],
  listName: string,
  listDescription: string,
  total: number,
) {
  const fullUrl = `${baseUrl}/${srpSlugParam}`;
  return getItemListSchema({
    baseUrl,
    listName,
    listDescription,
    numberOfItems: total,
    pageUrl: fullUrl,
    items: properties.map((property) => {
      const loc = getLocalitySlug(property);
      const citySrp = city ? srpSlug(city) : srpSlugParam;
      const path = loc
        ? `${citySrp}/${loc}/${createHdpSlug(property)}`
        : `${citySrp}/${createHdpSlug(property)}`;
      return { name: property.display_name || property.name, url: path };
    }),
  });
}

function buildSchemaBundle(options: {
  baseUrl: string;
  srpSlugParam: string;
  pageTitle: string;
  pageMetaDescription: string;
  breadcrumbItems: SrpBreadcrumbItem[];
  itemList: ReturnType<typeof buildPropertyItemList>;
  faqs: { question: string; answer: string }[];
  includeFaq: boolean;
}): SrpPageSchema {
  const fullUrl = `${options.baseUrl}/${options.srpSlugParam}`;
  return {
    webPage: getWebPageSchema({
      baseUrl: options.baseUrl,
      path: options.srpSlugParam,
      name: options.pageTitle,
      description: options.pageMetaDescription,
      fullUrl,
    }),
    breadcrumb: getBreadcrumbSchema(options.baseUrl, options.breadcrumbItems),
    itemList: options.itemList,
    ...(options.includeFaq &&
      options.faqs.length > 0 && {
        faqPage: getFAQPageSchema(options.faqs),
      }),
  };
}

async function loadLocalityLinks(
  city: string,
  livingType: "hostels" | "coliving",
): Promise<LocalityListItem[]> {
  const localityRaw = await fetchCityLocalities(city);
  const localityMap = new Map<string, LocalityListItem>();
  localityRaw.forEach((item) => {
    if (!localityMap.has(item.slug)) localityMap.set(item.slug, item);
  });
  let localityLinks = Array.from(localityMap.values());
  if (isKotaCity(city) && livingType === "hostels") {
    localityLinks = mergeKotaHostelSrpLocalities(localityLinks);
  }
  return localityLinks;
}

function localityPageFields(
  localityInfo: LocalityInfo | undefined,
  fallbacks: { startingRent: number; total: number; aboutText: string },
) {
  const startingRent = localityStartingRent(
    localityInfo,
    fallbacks.startingRent,
  );
  const dayFromHereItems = mapLocalityNearbyToDayFromHere(localityInfo?.nearby);
  return {
    heroSubtitle: formatStartingSubtitle(startingRent, fallbacks.total),
    heroImageSrc: localityHeroImageSrc(localityInfo),
    bentoTiles: localityInfo?.ratings
      ? mapLocalityBentoTiles(localityInfo.ratings)
      : undefined,
    dayFromHereItems: localityInfo ? dayFromHereItems : undefined,
    aboutText: localityAboutText(localityInfo, fallbacks.aboutText),
  };
}

function emptyResult(): null {
  return null;
}

export async function resolveSrpPage(
  srpSlugParam: string,
): Promise<SrpPageConfig | null> {
  const slug = String(srpSlugParam || "").trim().toLowerCase();
  if (!slug) return emptyResult();

  const baseUrl = getPublicSiteUrl();
  const cities = PRESENT_CITIES;

  const nearLandmark = parseNearLandmarkSrpSlug(slug);
  if (nearLandmark) {
    const { landmarkSlug, slugGender, livingType } = nearLandmark;
    const apiGender = genderFilterApiValue(undefined, slugGender);
    const { data, success, pageInfo, place, localityInfo } = await fetchPropertiesBySlug(
      {
        slug: landmarkSlug,
        filter: apiGender ? { gender: apiGender, amenities: [] } : undefined,
      },
      { page: 1, page_size: SRP_LIST_PAGE_SIZE },
    );
    if (!success || !Array.isArray(data) || data.length === 0) return emptyResult();

    const cityFromPlace =
      (place && typeof place === "object" ? place.city : "") ||
      data[0]?.address?.city ||
      "";
    const localityFromPlace =
      (place && typeof place === "object" ? place.locality : "") || "";
    const total = pageInfo?.total ?? data.length;
    const minRent = minRentFromProperties(data);
    const seo = getNearLandmarkSeo(
      nearLandmark,
      place && typeof place === "object" ? place : undefined,
      {
        minRent:
          nearLandmark.colivingNearKind === "room_for_rent" ? minRent : undefined,
      },
    );
    const landmarkLabel = [
      place?.display_name,
      localityFromPlace,
      cityFromPlace,
    ]
      .filter(Boolean)
      .join(", ");
    const breadcrumbItems: SrpBreadcrumbItem[] = [
      { name: "Home", path: "" },
      {
        name: slug
          .replace(/[-_]+/g, " ")
          .split(/\s+/)
          .map((word) =>
            word.toLowerCase() === "pg"
              ? "PG"
              : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join(" "),
        path: slug,
      },
    ];
    const listLabel = getNearLandmarkListLabel(nearLandmark, landmarkSlug);
    const itemList = buildPropertyItemList(
      baseUrl,
      slug,
      cityFromPlace,
      data,
      listLabel,
      seo.metaDescription,
      total,
    );
    const nearbyPlaces =
      cityFromPlace && localityFromPlace
        ? await fetchNearbyPlaces(cityFromPlace, localityFromPlace)
        : [];
    const relatedLandmarkLinks = nearbyPlaces
      .map((item) => ({
        href: buildNearLandmarkHref(nearLandmark, item.slug),
        label: getNearLandmarkListLabel(nearLandmark, item.slug),
      }))
      .filter((item) => Boolean(item.href) && item.href !== `/${slug}`)
      .filter(
        (item, index, array) =>
          array.findIndex((entry) => entry.href === item.href) === index,
      )
      .slice(0, 32);

    const localityFields = localityPageFields(localityInfo, {
      startingRent: minRent ?? data[0]?.min_rent ?? 0,
      total,
      aboutText: seo.pageDescription,
    });

    return {
      kind: "landmark",
      canonicalPath: slug,
      livingType,
      slugGender,
      city: cityFromPlace,
      localityName: localityFromPlace || undefined,
      landmarkSlug,
      properties: data,
      total,
      pageTitle: seo.pageTitle,
      pageMetaDescription: seo.metaDescription,
      pageDescription: seo.pageDescription,
      headerH1: seo.pageTitle,
      propertiesHeading: getPropertiesListHeading({
        total,
        city: cityFromPlace,
        landmarkLabel,
        livingType,
        isLandmark: true,
      }),
      ...localityFields,
      aboutTitle: "About this place",
      breadcrumbItems,
      localityLinks: [],
      relatedLandmarkLinks,
      faqs: [],
      hideFaqSection: true,
      schema: buildSchemaBundle({
        baseUrl,
        srpSlugParam: slug,
        pageTitle: seo.pageTitle,
        pageMetaDescription: seo.metaDescription,
        breadcrumbItems,
        itemList,
        faqs: [],
        includeFaq: false,
      }),
    };
  }

  type LocalityBranch = {
    city: string;
    localitySlug: string;
    slugGender?: "male only" | "female only";
    livingType: "hostels" | "coliving";
    pageTitle: string;
    pageMetaDescription: string;
    listLabel: string;
    breadcrumbItems: SrpBreadcrumbItem[];
    faqArea: string;
    faqGender?: "male only" | "female only";
  };

  async function resolveLocalityBranch(
    branch: LocalityBranch,
  ): Promise<SrpPageConfig | null> {
    const localityName = localitySlugToName(branch.localitySlug);
    const localityFilter = branch.localitySlug.replace(/-/g, " ");
    const apiGender = genderFilterApiValue(undefined, branch.slugGender);
    const { data, success, pageInfo, localityInfo } = await fetchAllProperty(
      {
        city: branch.city,
        localityName: localityFilter || undefined,
        filter: apiGender ? { gender: apiGender, amenities: [] } : undefined,
      },
      { page: 1, page_size: SRP_LIST_PAGE_SIZE },
    );
    if (!success || !Array.isArray(data) || data.length === 0) return emptyResult();

    const total = pageInfo?.total ?? data.length;
    const localityLinks = await loadLocalityLinks(branch.city, branch.livingType);
    const faqs = getFaqsForSchema(branch.city, branch.faqArea, branch.faqGender);
    const itemList = buildPropertyItemList(
      baseUrl,
      slug,
      branch.city,
      data,
      branch.listLabel,
      branch.pageMetaDescription,
      total,
    );
    const localityFields = localityPageFields(localityInfo, {
      startingRent: minRentFromProperties(data) ?? data[0]?.min_rent ?? 0,
      total,
      aboutText: branch.pageMetaDescription,
    });

    return {
      kind: "locality",
      canonicalPath: slug,
      livingType: branch.livingType,
      slugGender: branch.slugGender,
      city: branch.city,
      localityName,
      localitySlug: branch.localitySlug,
      properties: data,
      total,
      pageTitle: branch.pageTitle,
      pageMetaDescription: branch.pageMetaDescription,
      pageDescription: branch.pageMetaDescription,
      headerH1: branch.pageTitle,
      propertiesHeading: getPropertiesListHeading({
        total,
        city: branch.city,
        localityName,
        slugGender: branch.slugGender,
        livingType: branch.livingType,
      }),
      ...localityFields,
      aboutTitle: `About ${localityName}`,
      breadcrumbItems: branch.breadcrumbItems,
      localityLinks,
      relatedLandmarkLinks: [],
      faqs,
      hideFaqSection: false,
      schema: buildSchemaBundle({
        baseUrl,
        srpSlugParam: slug,
        pageTitle: branch.pageTitle,
        pageMetaDescription: branch.pageMetaDescription,
        breadcrumbItems: branch.breadcrumbItems,
        itemList,
        faqs,
        includeFaq: true,
      }),
    };
  }

  const kotaHostelFlat = parseFlatKotaGenderHostelSlug(slug);
  if (kotaHostelFlat) {
    const { city, localitySlug, slugGender } = kotaHostelFlat;
    const localityName = localitySlugToName(localitySlug);
    const cityLabel = "Kota";
    const cityGenderPath =
      slugGender === "male only" ? "boys-hostels-in-kota" : "girls-hostels-in-kota";
    const pageTitle =
      slugGender === "male only"
        ? `Boys Hostel in ${localityName} Kota | Furnished Hostel Near Coaching Institutes`
        : `Girls Hostel in ${localityName} Kota | Safe & Furnished Hostel Near Coaching Institutes`;
    const pageDescription = getFlatGenderLocalityMetaDescription(
      city,
      localityName,
      undefined,
      slugGender,
    );
    return resolveLocalityBranch({
      city,
      localitySlug,
      slugGender,
      livingType: "hostels",
      pageTitle,
      pageMetaDescription: pageDescription,
      listLabel:
        slugGender === "male only"
          ? `Boys hostels in ${localityName}, ${cityLabel}`
          : `Girls hostels in ${localityName}, ${cityLabel}`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: cityLabel, path: cityGenderPath },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
      faqGender: slugGender,
    });
  }

  const kotaGenericHostelFlat = parseFlatKotaGenericHostelSlug(slug);
  if (kotaGenericHostelFlat) {
    const { city, localitySlug } = kotaGenericHostelFlat;
    const localityName = localitySlugToName(localitySlug);
    return resolveLocalityBranch({
      city,
      localitySlug,
      livingType: "hostels",
      pageTitle: `Hostels in ${localityName} Kota | Boys & Girls Hostels Near Coaching Institutes`,
      pageMetaDescription: getFlatGenderLocalityMetaDescription(
        city,
        localityName,
      ),
      listLabel: `Student hostels and PG in ${localityName}, Kota`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: "Kota", path: "hostels-in-kota" },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
    });
  }

  const colivingFlat = parseFlatColivingLocalitySlug(slug, cities);
  if (colivingFlat) {
    const { city, localitySlug } = colivingFlat;
    const localityName = localitySlugToName(localitySlug);
    const seo = getFlatColivingLocalitySeo(city, localitySlug);
    const pageDescription = getFlatColivingLocalityMetaDescription(
      city,
      localityName,
    );
    const cityLabel = capitalizeFirstLetter(city.replace(/_/g, " "));
    return resolveLocalityBranch({
      city,
      localitySlug,
      livingType: "coliving",
      pageTitle: seo.pageTitle,
      pageMetaDescription: pageDescription,
      listLabel: `Coliving in ${localityName}, ${cityLabel}`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: cityLabel, path: `coliving-in-${city}` },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
    });
  }

  const pgFlat = parseFlatPgLocalitySlug(slug, cities);
  if (pgFlat) {
    const { city, localitySlug } = pgFlat;
    const localityName = localitySlugToName(localitySlug);
    const cityLabel = capitalizeFirstLetter(city.replace(/_/g, " "));
    const pageDescription = getFlatGenderLocalityMetaDescription(
      city,
      localityName,
    );
    return resolveLocalityBranch({
      city,
      localitySlug,
      livingType: "coliving",
      pageTitle: isKotaCity(city)
        ? `PG in ${localityName} Kota | Furnished PG for Students Near Coaching Institutes`
        : `PG in ${localityName}, ${cityLabel} | Furnished Rooms for Students & Working Professionals`,
      pageMetaDescription: pageDescription,
      listLabel: `PG in ${localityName}, ${cityLabel}`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: cityLabel, path: isKotaCity(city) ? "hostels-in-kota" : `pg-in-${city}` },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
    });
  }

  const roomForRentFlat = parseFlatRoomForRentLocalitySlug(slug, cities);
  if (roomForRentFlat) {
    const { city, localitySlug } = roomForRentFlat;
    const localityName = localitySlugToName(localitySlug);
    const cityLabel = capitalizeFirstLetter(city.replace(/_/g, " "));
    const pageDescription = getFlatColivingLocalityMetaDescription(
      city,
      localityName,
    );
    return resolveLocalityBranch({
      city,
      localitySlug,
      livingType: "coliving",
      pageTitle: `Single Room for Rent in ${localityName}, ${cityLabel} | HelloWorld`,
      pageMetaDescription: pageDescription,
      listLabel: `Rooms for rent in ${localityName}, ${cityLabel}`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: cityLabel, path: `coliving-in-${city}` },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
    });
  }

  const genderFlat = parseFlatGenderLocalitySlug(slug, cities);
  if (genderFlat) {
    const { city, localitySlug, slugGender } = genderFlat;
    const localityName = localitySlugToName(localitySlug);
    const cityLabel = capitalizeFirstLetter(city.replace(/_/g, " "));
    const cityListPath =
      slugGender === "male only" ? `pg-for-boys-in-${city}` : `pg-for-girls-in-${city}`;
    const pageDescription = getFlatGenderLocalityMetaDescription(
      city,
      localityName,
      undefined,
      slugGender,
    );
    return resolveLocalityBranch({
      city,
      localitySlug,
      slugGender,
      livingType: "coliving",
      pageTitle: getFlatGenderLocalityPageTitle(city, localityName, slugGender),
      pageMetaDescription: pageDescription,
      listLabel:
        slugGender === "male only"
          ? `Boys PG in ${localityName}, ${cityLabel}`
          : `Girls PG in ${localityName}, ${cityLabel}`,
      breadcrumbItems: [
        { name: "Home", path: "" },
        { name: cityLabel, path: cityListPath },
        { name: localityName, path: slug },
      ],
      faqArea: localityName,
      faqGender: slugGender,
    });
  }

  const parsed = parseMarketingSrpSlug(slug);
  if (!parsed || parsed.localityOnly) return emptyResult();

  const { city, livingType, slugGender } = parsed;
  const apiGender = genderFilterApiValue(undefined, slugGender);
  const { data, success, pageInfo, localityInfo } = await fetchAllProperty(
    {
      city,
      filter: apiGender ? { gender: apiGender, amenities: [] } : undefined,
    },
    { page: 1, page_size: SRP_LIST_PAGE_SIZE },
  );
  if (!success || !Array.isArray(data) || data.length === 0) return emptyResult();

  const total = pageInfo?.total ?? data.length;
  const localityLinks = await loadLocalityLinks(city, livingType);
  const isColivingSrpFamily = slug.startsWith("coliving-in-");
  const cityColivingSeo = getColivingCityMarketingSeoOverride(slug);
  const kotaCityHostelsSeo = getKotaCityHostelsSeoOverride(slug);
  const pageTitle =
    kotaCityHostelsSeo?.pageTitle ??
    cityColivingSeo?.pageTitle ??
    getSrpPageTitle(city, livingType, slugGender, isColivingSrpFamily);
  const pageMetaDescription = getSrpMetaDescription(
    city,
    livingType,
    total,
    slugGender,
  );
  const pageDescription = getSrpPageDescription(
    city,
    livingType,
    total,
    slugGender,
  );
  const cityLabel = capitalizeFirstLetter(city.replace(/_/g, " "));
  const listLabel =
    livingType === "hostels"
      ? slugGender === "male only"
        ? `Boys student hostels and PG in ${cityLabel}`
        : slugGender === "female only"
          ? `Girls student hostels and PG in ${cityLabel}`
          : `Student hostels and PG in ${cityLabel}`
      : slugGender === "male only"
        ? `Gents PG in ${cityLabel}`
        : slugGender === "female only"
          ? `Ladies PG in ${cityLabel}`
          : isColivingSrpFamily
            ? `Coliving PG in ${cityLabel}`
            : `PG in ${cityLabel}`;
  const faqs = getFaqsForSchema(city, undefined, slugGender);
  const breadcrumbItems: SrpBreadcrumbItem[] = [
    { name: "Home", path: "" },
    { name: listLabel, path: slug },
  ];
  const itemList = buildPropertyItemList(
    baseUrl,
    slug,
    city,
    data,
    listLabel,
    pageMetaDescription,
    total,
  );
  const localityFields = localityPageFields(localityInfo, {
    startingRent: minRentFromProperties(data) ?? data[0]?.min_rent ?? 0,
    total,
    aboutText: pageDescription,
  });

  return {
    kind: "city",
    canonicalPath: slug,
    livingType,
    slugGender,
    city,
    properties: data,
    total,
    pageTitle,
    pageMetaDescription,
    pageDescription,
    headerH1: pageTitle,
    propertiesHeading: getPropertiesListHeading({
      total,
      city,
      slugGender,
      livingType,
    }),
    ...localityFields,
    aboutTitle: `About ${cityLabel}`,
    breadcrumbItems,
    localityLinks,
    relatedLandmarkLinks: [],
    faqs,
    hideFaqSection: false,
    schema: buildSchemaBundle({
      baseUrl,
      srpSlugParam: slug,
      pageTitle,
      pageMetaDescription,
      breadcrumbItems,
      itemList,
      faqs,
      includeFaq: true,
    }),
  };
}
