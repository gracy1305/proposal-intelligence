"use client";
import Link from "next/link";

type RiskLevel = "High" | "Medium" | "Low";
type ActionType =
  | "Call now"
  | "Request missing terms"
  | "AI follow-up"
  | "Review proposal"
  | "No action";

type Proposal = {
  id: number;
  venue: string;
  location: string;
  status: string;
  responseTime: string;
  completeness: number | null;
  risk: RiskLevel;
  action: ActionType;
  reason: string;
};

const proposals: Proposal[] = [
  {
    id: 1,
    venue: "Andaz Mayakoba",
    location: "Riviera Maya, Mexico",
    status: "Awaiting response",
    responseTime: "19h 12m",
    completeness: null,
    risk: "High",
    action: "Call now",
    reason:
      "No response after two automated follow-ups. Proposal deadline is approaching.",
  },
  {
    id: 2,
    venue: "Grand Hyatt Playa del Carmen",
    location: "Playa del Carmen, Mexico",
    status: "Proposal received",
    responseTime: "13h 08m",
    completeness: 75,
    risk: "Medium",
    action: "Request missing terms",
    reason:
      "Proposal is missing cancellation terms and AV minimum requirements.",
  },
  {
    id: 3,
    venue: "Rosewood Mayakoba",
    location: "Riviera Maya, Mexico",
    status: "Proposal received",
    responseTime: "6h 21m",
    completeness: 96,
    risk: "Low",
    action: "Review proposal",
    reason: "Proposal is complete and ready for planner review.",
  },
  {
    id: 4,
    venue: "The Riviera Maya EDITION",
    location: "Kanai, Mexico",
    status: "Awaiting response",
    responseTime: "11h 04m",
    completeness: null,
    risk: "Medium",
    action: "AI follow-up",
    reason:
      "Response is slower than expected, but human intervention is not required yet.",
  },
  {
    id: 5,
    venue: "Waldorf Astoria Cancun",
    location: "Cancun, Mexico",
    status: "Proposal received",
    responseTime: "8h 47m",
    completeness: 91,
    risk: "Low",
    action: "Review proposal",
    reason: "Proposal passed completeness checks with high confidence.",
  },
  {
    id: 6,
    venue: "Conrad Tulum Riviera Maya",
    location: "Tulum, Mexico",
    status: "Awaiting response",
    responseTime: "4h 18m",
    completeness: null,
    risk: "Low",
    action: "No action",
    reason: "Venue remains comfortably inside the expected response window.",
  },
];

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const styles = {
    High: "border-red-200 bg-red-50 text-red-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

function ActionBadge({ action }: { action: ActionType }) {
  const urgent = action === "Call now";
  const warning = action === "Request missing terms";

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
        urgent
          ? "bg-red-600 text-white"
          : warning
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-100 text-slate-700"
      }`}
    >
      {action}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center border-b border-slate-100 px-7">
          <div>
            <p className="text-lg font-bold tracking-tight">
              Proposal Intelligence
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              RFP reliability engine
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6 text-sm">
          <button className="flex w-full items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-left font-medium text-white">
            <span>◫</span>
            Proposal Pipeline
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-500 transition hover:bg-slate-50">
            <span>⚡</span>
            Intervention Queue
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-500 transition hover:bg-slate-50">
            <span>◎</span>
            Venue Intelligence
          </button>
          <Link
          href="/analyze"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span>◇</span>
            Analyze Proposal
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-700">
            Independent product exploration
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Inspired by AI-powered venue sourcing workflows.
          </p>
        </div>
      </aside>

      <section className="lg:pl-64">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Active sourcing event
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight">
                Acme Leadership Retreat
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                ● Live pipeline
              </span>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                Export report
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
          {/* Event summary */}
          <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  Cancun, Mexico
                </span>
                <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  180 attendees
                </span>
                <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  Oct 12–15
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Proposal Pipeline
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Prioritize venue responses by SLA risk, proposal completeness,
                and the level of human intervention required.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Proposal SLA
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                1–2 business days
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Venues contacted" value="24" detail="Active RFPs" />
            <MetricCard
              label="Proposals received"
              value="16"
              detail="67% response rate"
            />
            <MetricCard
              label="Awaiting response"
              value="5"
              detail="Across active venues"
            />
            <MetricCard
              label="Need attention"
              value="3"
              detail="Human review recommended"
              alert
            />
            <MetricCard
              label="Within SLA"
              value="87%"
              detail="Target ≥ 90%"
            />
          </div>

          {/* Priority alert */}
          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-5 md:flex-row md:items-center">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                !
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">
                  3 proposals may require intervention
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Andaz Mayakoba has the highest SLA risk with no response after
                  two automated follow-ups.
                </p>
              </div>
            </div>

            <button className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
              Review interventions →
            </button>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="font-bold">Venue responses</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Ranked by recommended intervention priority
                </p>
              </div>

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-semibold">Venue</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Elapsed</th>
                    <th className="px-6 py-4 font-semibold">Completeness</th>
                    <th className="px-6 py-4 font-semibold">SLA risk</th>
                    <th className="px-6 py-4 font-semibold">Recommended action</th>
                  </tr>
                </thead>

                <tbody>
                  {proposals.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        {proposal.id === 1 ? (
                          <Link
                          href={`/interventions/${proposal.id}`}
                          className="text-sm font-bold text-slate-900 underline-offset-4 transition hover:text-red-600 hover:underline"
                          >
                            {proposal.venue}
                          </Link>
                        ) : proposal.id === 2 ? (
                          <Link
                          href={`/proposals/${proposal.id}`}
                          className="text-sm font-bold text-slate-900 underline-offset-4 transition hover:text-blue-600 hover:underline"
                          >
                            {proposal.venue}
                            </Link>
                            ) : (
                            <p className="text-sm font-bold text-slate-900">
                              {proposal.venue}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-slate-400">
                              {proposal.location}
                              </p>
                              </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {proposal.status}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {proposal.responseTime}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {proposal.completeness !== null ? (
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${
                                  proposal.completeness < 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${proposal.completeness}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-600">
                              {proposal.completeness}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <RiskBadge risk={proposal.risk} />
                      </td>

                      <td className="px-6 py-5">
                        <ActionBadge action={proposal.action} />
                        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
                          {proposal.reason}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="py-6 text-center text-xs text-slate-400">
            Built independently as a product engineering exploration. Not
            affiliated with Nowadays.
          </p>
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  alert = false,
}: {
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {alert && (
          <span className="h-2 w-2 rounded-full bg-red-500">
            <span className="sr-only">Attention required</span>
          </span>
        )}
      </div>

      <p
        className={`mt-3 text-3xl font-bold tracking-tight ${
          alert ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}