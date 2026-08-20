import Link from "next/link";
import type { LocalityListItem } from "@/src/apis/srp";
import {
  colivingFlatLocalityPath,
  genderedHostelsSrpSlug,
  kotaHostelsFlatLocalityPath,
  roomForRentFlatLocalityPath,
} from "@/src/lib/sitemap-slug";
import {
  kotaCityHostelSeoLinks,
  resolveSrpLocalitySeoLinkFlags,
  shouldShowSrpLocalitySeoLinks,
} from "@/src/lib/srp/srp-locality-seo-links";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import { getCityLabel } from "@/src/tokens/cities";
import { cn } from "@/src/lib/cn";

const linkClassName =
  "block truncate text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900";

function SeoLinkGroup({
  links,
}: {
  links: readonly { href: string; label: string; title?: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClassName}
          title={link.title ?? link.label}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function LocalitySeoLinks({
  item,
  flags,
  srpPath,
  city,
}: {
  item: LocalityListItem;
  flags: ReturnType<typeof resolveSrpLocalitySeoLinkFlags>;
  srpPath: string;
  city: string;
}) {
  const {
    kotaHostelLocalityTripleLinks,
    kotaSingularHostelFlatLinks,
    colivingLocalityQuadLinks,
    pgLocalityWithRoomLinks,
    genderLocalityWithRoomLinks,
    colivingStyleCityKey,
    pgBrowseCityKey,
    genderFlatCityKey,
    genderFlatLinkVariant,
    localityLinkPrefix,
  } = flags;

  if (kotaHostelLocalityTripleLinks) {
    return (
      <SeoLinkGroup
        links={[
          {
            href: kotaHostelsFlatLocalityPath(item.slug),
            label: `Student hostels in ${item.name}`,
          },
          {
            href: kotaSingularHostelFlatLinks
              ? `/boys-hostel-in-${item.slug}-kota`
              : `/${genderedHostelsSrpSlug(city, "boys")}/${item.slug}`,
            label: `Boys hostels in ${item.name}`,
          },
          {
            href: kotaSingularHostelFlatLinks
              ? `/girls-hostel-in-${item.slug}-kota`
              : `/${genderedHostelsSrpSlug(city, "girls")}/${item.slug}`,
            label: `Girls hostels in ${item.name}`,
          },
        ]}
      />
    );
  }

  if (colivingLocalityQuadLinks && colivingStyleCityKey) {
    return (
      <SeoLinkGroup
        links={[
          {
            href: colivingFlatLocalityPath(colivingStyleCityKey, item.slug),
            label: `Coliving PG in ${item.name}`,
          },
          {
            href: `/pg-for-boys-in-${item.slug}-${colivingStyleCityKey}`,
            label: `PG for Men in ${item.name}`,
          },
          {
            href: `/pg-for-girls-in-${item.slug}-${colivingStyleCityKey}`,
            label: `PG for Women in ${item.name}`,
          },
          {
            href: roomForRentFlatLocalityPath(colivingStyleCityKey, item.slug),
            label: `Room for rent in ${item.name}`,
          },
        ]}
      />
    );
  }

  if (pgLocalityWithRoomLinks && pgBrowseCityKey) {
    return (
      <SeoLinkGroup
        links={[
          {
            href: `/pg-in-${item.slug}-${pgBrowseCityKey}`,
            label: `PG in ${item.name}`,
          },
          {
            href: roomForRentFlatLocalityPath(pgBrowseCityKey, item.slug),
            label: `Room for rent in ${item.name}`,
          },
        ]}
      />
    );
  }

  if (
    genderLocalityWithRoomLinks &&
    genderFlatCityKey &&
    genderFlatLinkVariant
  ) {
    const genderLabel =
      genderFlatLinkVariant === "boys" ? "PG for Men in" : "PG for Women in";

    return (
      <SeoLinkGroup
        links={[
          {
            href: `/pg-for-${genderFlatLinkVariant}-in-${item.slug}-${genderFlatCityKey}`,
            label: `${genderLabel} ${item.name}`,
          },
          {
            href: colivingFlatLocalityPath(genderFlatCityKey, item.slug),
            label: `Coliving PG in ${item.name}`,
          },
          {
            href: roomForRentFlatLocalityPath(genderFlatCityKey, item.slug),
            label: `Room for rent in ${item.name}`,
          },
        ]}
      />
    );
  }

  const href =
    genderFlatCityKey && genderFlatLinkVariant
      ? `/pg-for-${genderFlatLinkVariant}-in-${item.slug}-${genderFlatCityKey}`
      : colivingStyleCityKey
        ? colivingFlatLocalityPath(colivingStyleCityKey, item.slug)
        : pgBrowseCityKey
          ? `/pg-in-${item.slug}-${pgBrowseCityKey}`
          : `/${srpPath}/${item.slug}`;

  if (!href) return null;

  return (
    <Link href={href} className={linkClassName} title={`${localityLinkPrefix} ${item.name}`}>
      {`${localityLinkPrefix} ${item.name}`}
    </Link>
  );
}

export function SrpLocalitySeoLinks({
  config,
  className,
}: {
  config: SrpPageConfig;
  className?: string;
}) {
  if (!shouldShowSrpLocalitySeoLinks(config)) return null;

  const flags = resolveSrpLocalitySeoLinkFlags(config);
  const cityLabel = getCityLabel(config.city);

  return (
    <section
      aria-label={`Localities in ${cityLabel}`}
      className={cn(className)}
    >
      <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
        Explore localities in {cityLabel}
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {flags.kotaHostelLocalityTripleLinks && flags.kotaCityLabel ? (
          <li key="kota-city-srp" className="min-w-0">
            <SeoLinkGroup links={kotaCityHostelSeoLinks(config.city)} />
          </li>
        ) : null}
        {config.localityLinks.map((item) => (
          <li key={item.slug} className="min-w-0">
            <LocalitySeoLinks
              item={item}
              flags={flags}
              srpPath={config.canonicalPath}
              city={config.city}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
