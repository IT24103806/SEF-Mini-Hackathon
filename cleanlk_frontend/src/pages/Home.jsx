import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  LeafIcon,
  LoaderIcon,
  MegaphoneIcon,
  SearchIcon,
  SproutIcon,
  UsersIcon,
} from "../components/icons";
import { getWasteReports } from "../api/wasteReports";

const features = [
  {
    number: "01",
    title: "Report Local Issues",
    body: "Quickly report uncollected garbage, overflowing bins and illegal dumping.",
    Icon: MegaphoneIcon,
  },
  {
    number: "02",
    title: "Track Community Reports",
    body: "Search and monitor waste problems reported across different communities.",
    Icon: SearchIcon,
  },
  {
    number: "03",
    title: "Check Collection Schedules",
    body: "Find useful waste collection information for supported areas.",
    Icon: CalendarDaysIcon,
  },
  {
    number: "04",
    title: "Build Cleaner Communities",
    body: "Make local waste problems more visible and encourage community awareness.",
    Icon: UsersIcon,
  },
];

const steps = [
  { number: "01", title: "REPORT", body: "Submit a local waste problem." },
  {
    number: "02",
    title: "TRACK",
    body: "View and search community reports.",
  },
  {
    number: "03",
    title: "ACT",
    body: "Use shared information to support cleaner neighbourhoods.",
  },
];

export default function Home() {
  const [counts, setCounts] = useState({ total: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    getWasteReports()
      .then((reports) => {
        setCounts({
          total: reports.length,
          inProgress: reports.filter((r) => r.status === "In Progress").length,
          resolved: reports.filter((r) => r.status === "Resolved").length,
        });
      })
      .catch((error) => {
        console.error("Failed to load report counts", error);
      });
  }, []);

  const overview = [
    {
      value: counts.total,
      label: "Reports Submitted",
      percent: 100,
      bar: "bg-brand-700",
    },
    {
      value: counts.inProgress,
      label: "In Progress",
      percent: counts.total ? (counts.inProgress / counts.total) * 100 : 0,
      bar: "bg-amber-500",
    },
    {
      value: counts.resolved,
      label: "Resolved",
      percent: counts.total ? (counts.resolved / counts.total) * 100 : 0,
      bar: "bg-fresh-500",
    },
  ];

  const stats = [
    {
      value: counts.total,
      label: "Reports Submitted",
      Icon: ClipboardListIcon,
      tone: "bg-brand-50 text-brand-600",
    },
    {
      value: counts.inProgress,
      label: "Issues In Progress",
      Icon: LoaderIcon,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      value: counts.resolved,
      label: "Issues Resolved",
      Icon: CheckCircle2Icon,
      tone: "bg-fresh-50 text-fresh-600",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-canvas">
        <div className="mx-auto grid max-w-shell items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <SproutIcon className="h-3.5 w-3.5" />
              Cleaner Communities. Better Sri Lanka.
            </span>

            <h1 className="mt-6 text-[34px] font-bold leading-[1.1] text-ink sm:text-5xl lg:text-[56px]">
              Keep Sri Lanka Clean,
              <br />
              <span className="text-brand-600">One Report at a Time.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-muted sm:text-[17px]">
              CleanLK makes it easier for Sri Lankan communities to report
              waste problems, track local concerns and access useful
              waste-management information.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/waste-reports/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3.5 text-[15px] font-semibold text-white shadow-card transition-[background-color,transform] duration-150 hover:bg-brand-800 active:translate-y-px"
              >
                Report a Waste Issue
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/waste-reports"
                className="inline-flex items-center justify-center rounded-xl border border-line-strong bg-white px-5 py-3.5 text-[15px] font-semibold text-ink-soft transition-colors duration-150 hover:border-brand-300 hover:text-brand-700"
              >
                View Waste Reports
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-faint">
              Simple • Community-driven • Built for Sri Lanka
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 hidden h-28 w-28 rounded-full border border-brand-100 lg:block"
            />

            <figure className="relative">
              <div className="flex h-[300px] w-full items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-100 via-brand-50 to-fresh-50 shadow-lift sm:h-[380px] lg:h-[460px]">
                <LeafIcon className="h-20 w-20 text-brand-300" strokeWidth={1.25} />
              </div>
              <figcaption className="sr-only">
                Illustration representing community clean-up efforts.
              </figcaption>
            </figure>

            <div className="relative z-10 mx-4 -mt-14 rounded-[18px] border border-line bg-white p-5 shadow-lift sm:mx-6 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[15px] font-bold text-ink">
                  Community Overview
                </h2>
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <LeafIcon className="h-4 w-4" />
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-4">
                {overview.map((item) => (
                  <div key={item.label}>
                    <dd className="text-2xl font-bold tabular-nums leading-none text-ink sm:text-[28px]">
                      {item.value}
                    </dd>
                    <dt className="mt-1.5 text-[11px] font-medium leading-snug text-ink-muted sm:text-xs">
                      {item.label}
                    </dt>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                      <div
                        className={`h-full rounded-full ${item.bar}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="mx-auto max-w-shell px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {stats.map(({ value, label, Icon, tone }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-card border border-line bg-white p-5 shadow-card transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift sm:p-6"
            >
              <span
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-3xl font-bold tabular-nums leading-none text-ink">
                  {value}
                </p>
                <p className="mt-1.5 text-sm font-medium text-ink-muted">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why CleanLK */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-[26px] font-bold leading-tight text-ink sm:text-[34px]">
              A Smarter Way to Keep Communities Clean
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
              Simple digital tools that help residents report, track and
              understand local waste issues.
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-12">
            {features.map(({ number, title, body, Icon }) => (
              <div key={number} className="flex gap-4 border-t border-line pt-6 sm:gap-5">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink-faint">
                    {number}
                  </p>
                  <h3 className="mt-1 text-[17px] font-bold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="text-[26px] font-bold text-ink sm:text-[34px]">
          How CleanLK Works
        </h2>

        <div className="mt-10 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="contents">
              <div className="flex-1 rounded-card border border-line bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-700">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center text-brand-300"
                >
                  <ArrowRightIcon className="hidden h-5 w-5 md:block" />
                  <ArrowDownIcon className="h-5 w-5 md:hidden" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-shell px-5 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[20px] bg-brand-800 px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-16 h-48 w-48 rounded-full border border-white/10"
          />
          <LeafIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-8 hidden h-10 w-10 text-white/15 sm:block"
          />

          <div className="relative max-w-2xl">
            <h2 className="text-[26px] font-bold leading-tight text-white sm:text-[34px]">
              Small Reports Can Create Bigger Change.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-100 sm:text-base">
              Making local waste issues easier to report and track can help
              communities become more aware, organised and environmentally
              responsible.
            </p>
            <Link
              to="/waste-reports/new"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-[15px] font-semibold text-brand-800 transition-[background-color,transform] duration-150 hover:bg-brand-50 active:translate-y-px"
            >
              Report an Issue Now
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
