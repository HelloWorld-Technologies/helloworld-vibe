import { pageLayout } from "@/src/tokens/layout";

export default function SrpSegmentLoading() {
  return (
    <div className={pageLayout.containerWithTopPadding} aria-hidden>
      <div className="animate-pulse space-y-6 py-6">
        <div className="h-10 w-2/3 rounded-lg bg-gray-200" />
        <div className="h-5 w-1/2 rounded-lg bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-56 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
