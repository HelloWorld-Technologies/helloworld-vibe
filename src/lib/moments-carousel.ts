const SCROLL_EDGE_PX = 4;

export function getMomentsVisibleCount(
  container: HTMLElement,
  gapPx: number,
): number {
  const first = container.children[0] as HTMLElement | undefined;
  if (!first) return 1;
  const cardWidth = first.getBoundingClientRect().width;
  if (cardWidth <= 0) return 1;
  return Math.max(
    1,
    Math.floor((container.clientWidth + gapPx) / (cardWidth + gapPx)),
  );
}

export function getMomentsPageStartIndex(
  container: HTMLElement,
  page: number,
  gapPx: number,
): number {
  const visible = getMomentsVisibleCount(container, gapPx);
  return Math.min(page * visible, Math.max(0, container.children.length - 1));
}

export function getMomentsCarouselState(
  container: HTMLElement,
  gapPx: number,
): {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  pageCount: number;
  activePage: number;
} {
  const canScrollPrev = container.scrollLeft > SCROLL_EDGE_PX;
  const canScrollNext =
    container.scrollLeft + container.clientWidth <
    container.scrollWidth - SCROLL_EDGE_PX;

  const cards = Array.from(container.children) as HTMLElement[];
  if (cards.length === 0) {
    return {
      canScrollPrev: false,
      canScrollNext: false,
      pageCount: 1,
      activePage: 0,
    };
  }

  const visible = getMomentsVisibleCount(container, gapPx);
  const pageCount = Math.max(1, Math.ceil(cards.length / visible));

  // At the end (or start), snap the active page to match arrow disabled state.
  // Partial last pages leave a non-page-aligned leftmost card, which otherwise
  // keeps the previous page active while a trailing dot stays inactive.
  if (!canScrollNext) {
    return {
      canScrollPrev,
      canScrollNext,
      pageCount,
      activePage: pageCount - 1,
    };
  }
  if (!canScrollPrev) {
    return {
      canScrollPrev,
      canScrollNext,
      pageCount,
      activePage: 0,
    };
  }

  const scrollLeft = container.scrollLeft;
  const cardIndex = cards.findIndex((_, index) => {
    const nextCard = cards[index + 1];
    if (!nextCard) return true;
    return scrollLeft < nextCard.offsetLeft - container.offsetLeft - gapPx;
  });
  const safeIndex = cardIndex === -1 ? 0 : cardIndex;
  const activePage = Math.min(
    pageCount - 1,
    Math.floor(safeIndex / visible),
  );

  return { canScrollPrev, canScrollNext, pageCount, activePage };
}
