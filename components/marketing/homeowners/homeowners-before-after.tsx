import { homeownersScrollVideo } from "@/src/tokens/homeowners";
import { cn } from "@/src/lib/cn";

export function HomeownersBeforeAfter({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(16,24,40,0.08)]",
        className,
      )}
    >
      <video
        className="absolute inset-0 size-full object-cover"
        src={homeownersScrollVideo}
        muted
        loop
        playsInline
        autoPlay
        aria-label="Before and after HelloWorld property transformation"
      />
    </div>
  );
}
