"use client";

import Link from "next/link";
import { HomepageAsset } from "@/components/marketing/homepage-asset";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";
import type {
  ErrorStateAction,
  ErrorStateActionVariant,
  ErrorStateConfig,
} from "@/src/tokens/error-states";

type ErrorStateActionWithHandler = ErrorStateAction & {
  onClick?: () => void;
};

function actionClassName(
  variant: ErrorStateActionVariant = "primary",
  shape: "pill" | "rectangle" = "pill",
) {
  return cn(
    "inline-flex h-12 min-w-[9.5rem] items-center justify-center px-6 text-base font-bold transition-colors",
    shape === "rectangle" ? "rounded-lg" : "rounded-full",
    variant === "primary"
      ? "bg-hello-lime-400 text-gray-800 hover:bg-hello-lime-500"
      : "border border-hello-lime-400 bg-white text-gray-800 hover:bg-hello-lime-50",
  );
}

function ErrorStateActionButton({
  action,
  shape = "pill",
}: {
  action: ErrorStateActionWithHandler;
  shape?: "pill" | "rectangle";
}) {
  const className = actionClassName(action.variant, shape);

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export function ErrorState({
  id,
  title,
  description,
  image,
  imageWidth,
  imageHeight,
  actions,
}: Pick<
  ErrorStateConfig,
  "title" | "description" | "image" | "imageWidth" | "imageHeight"
> & {
  id?: ErrorStateConfig["id"];
  actions: ErrorStateActionWithHandler[];
}) {
  const isNotFound = id === "not-found";

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className={cn(pageShell.errorContent, "flex flex-col items-center text-center")}>
        <HomepageAsset
          asset={image}
          width={imageWidth}
          height={imageHeight}
          className="h-auto w-full max-w-[18rem] sm:max-w-[20rem]"
          priority
        />

        <h1
          className={cn(
            "mt-8 font-bold text-gray-900",
            isNotFound
              ? "text-3xl leading-9 sm:mt-10 sm:text-4xl sm:leading-[2.75rem] lg:text-[2.4rem] lg:leading-[3.25rem]"
              : "text-2xl leading-8 sm:mt-10 sm:text-[2rem] sm:leading-10",
          )}
        >
          {title}
        </h1>

        <p
          className={cn(
            "mt-3 max-w-lg text-base leading-7",
            isNotFound ? "text-gray-800 sm:text-lg sm:leading-8" : "text-gray-600",
          )}
        >
          {description}
        </p>

        {actions.length > 0 ? (
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center">
            {actions.map((action) => (
              <ErrorStateActionButton
                key={action.label}
                action={action}
                shape={isNotFound ? "rectangle" : "pill"}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
