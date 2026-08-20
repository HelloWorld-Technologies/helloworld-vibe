import Image from "next/image";
import {
  helloWorldLivingHeroImage,
  helloWorldLivingPageCopy,
} from "@/src/tokens/hello-world-living";
import { pageLayout } from "@/src/tokens/layout";

export function HelloWorldLivingContent() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className={pageLayout.container}>
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-lg md:w-5/12 md:max-w-none">
            <Image
              src={helloWorldLivingHeroImage}
              alt="Hello World Living"
              width={720}
              height={900}
              priority
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          <div className="w-full max-w-xl text-center md:w-5/12 md:max-w-none md:text-left">
            <h1 className="font-satoshi text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {helloWorldLivingPageCopy.headline}
            </h1>
            <div
              aria-hidden
              className="mx-auto mt-4 h-1 w-20 rounded-full bg-hello-lime-500 md:mx-0"
            />
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              {helloWorldLivingPageCopy.body}
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-3xl md:mt-16 md:px-4">
          <h2 className="font-satoshi text-2xl font-bold text-gray-900">
            {helloWorldLivingPageCopy.mailingTitle}
          </h2>
          <p className="mt-3 font-semibold text-gray-900">
            {helloWorldLivingPageCopy.companyName}
          </p>
          <p className="mt-1 text-base leading-relaxed text-gray-600">
            {helloWorldLivingPageCopy.address}
          </p>
        </div>
      </div>
    </section>
  );
}
