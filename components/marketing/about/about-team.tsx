import { AboutPersonCard } from "@/components/marketing/about/about-person-card";
import {
  aboutCoreTeam,
  aboutLeadership,
  aboutPageCopy,
} from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

export function AboutLeadership() {
  return (
    <section className="bg-white py-8 md:py-12" aria-labelledby="about-leadership-heading">
      <div className={pageLayout.container}>
        <h2
          id="about-leadership-heading"
          className="text-center text-2xl font-medium text-black md:text-3xl"
        >
          {aboutPageCopy.leadershipTitle}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {aboutLeadership.map((person) => (
            <AboutPersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutCoreTeam() {
  return (
    <section className="bg-white py-8 md:py-12" aria-labelledby="about-core-team-heading">
      <div className={pageLayout.container}>
        <h2
          id="about-core-team-heading"
          className="text-center text-2xl font-medium text-black md:text-3xl"
        >
          {aboutPageCopy.coreTeamTitle}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {aboutCoreTeam.map((person) => (
            <AboutPersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
