"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAllProperty,
  fetchPropertiesBySlug,
  SRP_LIST_PAGE_SIZE,
} from "@/src/apis/srp";
import {
  buildSrpApiFilter,
  buildSrpApiSorting,
  hasActiveSrpQueryFilters,
  serializeSrpQuery,
} from "@/src/lib/srp/build-srp-api-payload";
import type { SrpPageKind } from "@/src/lib/srp/resolve-srp-page";
import { useDebounce } from "@/src/lib/use-debounce";
import { useSelectedVibes } from "@/src/lib/use-selected-vibes";
import { useVibeList } from "@/src/lib/use-vibe-list";
import { selectedVibeApiIds } from "@/src/lib/vibe-list-storage";
import type { SrpQuery } from "@/src/models/srp-query";
import type { Property } from "@/src/models/property";

export type SrpPaginationContext = {
  kind: SrpPageKind;
  city: string;
  localitySlug?: string;
  landmarkSlug?: string;
  slugGender?: "male only" | "female only";
};

const LOAD_ROOT_MARGIN_PX = 400;
/** Wait for vibe chip clicks to settle before refetching listings. */
const VIBE_FILTER_DEBOUNCE_MS = 400;

function sentinelNearViewport(sentinel: HTMLElement) {
  return sentinel.getBoundingClientRect().top <= window.innerHeight + LOAD_ROOT_MARGIN_PX;
}

function mergeUniqueProperties(previous: Property[], incoming: Property[]) {
  if (incoming.length === 0) return previous;

  const seen = new Set(previous.map((property) => property.id));
  const uniqueIncoming = incoming.filter((property) => !seen.has(property.id));
  if (uniqueIncoming.length === 0) return previous;

  return [...previous, ...uniqueIncoming];
}

async function fetchSrpPage(
  context: SrpPaginationContext,
  query: SrpQuery,
  page: number,
  vibeIds: readonly number[],
) {
  const filter = buildSrpApiFilter(query, context.slugGender, vibeIds);
  const sorting = buildSrpApiSorting(query.sort);
  const params = { page, page_size: SRP_LIST_PAGE_SIZE };

  if (context.kind === "landmark" && context.landmarkSlug) {
    return fetchPropertiesBySlug(
      { slug: context.landmarkSlug, filter, sorting },
      params,
    );
  }

  return fetchAllProperty(
    {
      city: context.city,
      localityName: context.localitySlug?.replace(/-/g, " "),
      filter,
      sorting,
    },
    params,
  );
}

export function useSrpPagination(
  initialProperties: Property[],
  initialTotal: number,
  context: SrpPaginationContext,
  resetKey: string,
  query: SrpQuery,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const { selectedVibes } = useSelectedVibes();
  const { vibes } = useVibeList();
  const vibeIds = useMemo(
    () => selectedVibeApiIds(selectedVibes, vibes),
    [selectedVibes, vibes],
  );
  const vibeKey = vibeIds.join(",");
  const debouncedVibeKey = useDebounce(vibeKey, VIBE_FILTER_DEBOUNCE_MS);
  const debouncedVibeIds = useMemo(() => {
    if (!debouncedVibeKey) return [] as number[];
    return debouncedVibeKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [debouncedVibeKey]);
  const vibesPending = vibeKey !== debouncedVibeKey;

  const [properties, setProperties] = useState(initialProperties);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(
    () => initialTotal > initialProperties.length,
  );

  const pageRef = useRef(1);
  const hasMoreRef = useRef(initialTotal > initialProperties.length);
  const totalRef = useRef(initialTotal);
  const loadingRef = useRef(false);
  const contextRef = useRef(context);
  const queryRef = useRef(query);
  const vibeIdsRef = useRef(debouncedVibeIds);
  const initialPropertiesRef = useRef(initialProperties);
  const initialTotalRef = useRef(initialTotal);
  const sentinelRef = useRef<HTMLDivElement>(null);

  contextRef.current = context;
  queryRef.current = query;
  vibeIdsRef.current = debouncedVibeIds;
  initialPropertiesRef.current = initialProperties;
  initialTotalRef.current = initialTotal;
  totalRef.current = total;

  const queryKey = serializeSrpQuery(query);
  const resetSnapshot = `${resetKey}:${initialTotal}:${initialProperties.length}:${queryKey}:${debouncedVibeKey}`;

  useEffect(() => {
    if (vibesPending) {
      setIsRefreshing(true);
    }
  }, [vibesPending]);

  useEffect(() => {
    let cancelled = false;

    async function syncListings() {
      const currentQuery = queryRef.current;
      const currentVibeIds = vibeIdsRef.current;
      const currentInitialProperties = initialPropertiesRef.current;
      const currentInitialTotal = initialTotalRef.current;

      if (!hasActiveSrpQueryFilters(currentQuery) && currentVibeIds.length === 0) {
        setProperties(currentInitialProperties);
        setTotal(currentInitialTotal);
        pageRef.current = 1;
        const more = currentInitialTotal > currentInitialProperties.length;
        hasMoreRef.current = more;
        setHasMore(more);
        loadingRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      setIsRefreshing(true);
      loadingRef.current = true;

      try {
        const response = await fetchSrpPage(
          contextRef.current,
          currentQuery,
          1,
          currentVibeIds,
        );
        if (cancelled) return;

        const nextData = response.success && Array.isArray(response.data)
          ? response.data
          : [];
        const nextTotal = response.pageInfo?.total ?? nextData.length;

        setProperties(nextData);
        setTotal(nextTotal);
        pageRef.current = 1;
        const more = nextData.length > 0 && nextData.length < nextTotal;
        hasMoreRef.current = more;
        setHasMore(more);
      } catch {
        if (!cancelled) {
          setProperties([]);
          setTotal(0);
          pageRef.current = 1;
          hasMoreRef.current = false;
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          loadingRef.current = false;
          setIsRefreshing(false);
        }
      }
    }

    void syncListings();

    return () => {
      cancelled = true;
    };
  }, [resetSnapshot]);

  const loadMore = useCallback(async () => {
    if (!enabledRef.current || loadingRef.current || !hasMoreRef.current) return;

    const nextPage = pageRef.current + 1;
    loadingRef.current = true;
    pageRef.current = nextPage;
    setIsLoading(true);

    try {
      const response = await fetchSrpPage(
        contextRef.current,
        queryRef.current,
        nextPage,
        vibeIdsRef.current,
      );

      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setProperties((prev) => {
          const merged = mergeUniqueProperties(prev, response.data);
          const added = merged.length - prev.length;
          const nextTotal = response.pageInfo?.total ?? totalRef.current;
          totalRef.current = nextTotal;
          setTotal(nextTotal);
          const more = added > 0 && merged.length < nextTotal;
          hasMoreRef.current = more;
          setHasMore(more);
          if (added === 0) {
            pageRef.current = nextPage - 1;
          }
          return merged;
        });
      } else {
        pageRef.current = nextPage - 1;
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch {
      pageRef.current = nextPage - 1;
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const maybeLoadMore = useCallback(() => {
    if (!enabledRef.current) return;
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMoreRef.current || loadingRef.current) return;
    if (!sentinelNearViewport(sentinel)) return;
    void loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!enabled || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!enabledRef.current) return;
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: `${LOAD_ROOT_MARGIN_PX}px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, hasMore, loadMore]);

  useEffect(() => {
    if (!enabled || !hasMore) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        maybeLoadMore();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, hasMore, maybeLoadMore]);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading || isRefreshing) return;
    requestAnimationFrame(() => {
      maybeLoadMore();
    });
  }, [enabled, properties.length, hasMore, isLoading, isRefreshing, maybeLoadMore]);

  return {
    properties,
    total,
    isLoading,
    isRefreshing,
    hasMore,
    sentinelRef,
  };
}
