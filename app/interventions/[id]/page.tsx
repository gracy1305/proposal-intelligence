"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SLAResult = {
  score: number;
  level: "High" | "Medium" | "Low";
  recommended_action: string;
  hours_remaining: number;
};

export default function InterventionDetail() {
  const [analysis, setAnalysis] = useState<SLAResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function calculateRisk() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/score/sla`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hours_elapsed: 19.2,
              sla_hours: 24,
              followup_count: 2,
              historical_response_hours: 8,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("SLA analysis failed");
        }

        const result: SLAResult = await response.json();
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }

    calculateRisk();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Proposal Pipeline
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
              Intervention Intelligence
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Andaz Mayakoba
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Acme Leadership Retreat · Riviera Maya, Mexico
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              SLA Risk
            </p>

            {error ? (
              <p className="mt-2 font-bold text-red-700">API error</p>
            ) : analysis ? (
              <div className="mt-1 flex items-end gap-3">
                <p className="text-3xl font-bold text-red-800">
                  {analysis.score}
                </p>

                <p className="pb-1 text-sm font-semibold text-red-700">
                  {analysis.level} risk
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-red-700">
                Calculating...
              </p>
            )}
          </div>
        </div>

        {/* Main recommendation */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 bg-red-50/70 p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Recommended intervention
                </p>

                <h2 className="mt-2 text-2xl font-bold text-red-950">
                  {analysis
                    ? analysis.recommended_action
                    : "Evaluating response risk..."}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-red-700">
                  Automated outreach has not produced a response and this venue
                  is significantly beyond its historical response window.
                </p>
              </div>

              <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700">
                Start human follow-up →
              </button>
            </div>
          </div>

          {/* Explainability */}
          <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <Signal
              label="Time elapsed"
              value="19.2h"
              detail="Since RFP sent"
            />

            <Signal
              label="Historical response"
              value="~8h"
              detail="Typical venue response"
            />

            <Signal
              label="AI follow-ups"
              value="2"
              detail="No response"
            />

            <Signal
              label="SLA remaining"
              value={analysis ? `${analysis.hours_remaining}h` : "—"}
              detail="Before threshold"
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="font-bold">Outreach timeline</h2>

              <p className="mt-1 text-xs text-slate-400">
                AI actions and venue response signals.
              </p>
            </div>

            <div className="p-6">
              <TimelineItem
                time="19h 12m ago"
                title="RFP sent"
                detail="Proposal request delivered to group sales contact."
                done
              />

              <TimelineItem
                time="11h 04m ago"
                title="First automated follow-up"
                detail="No response detected after expected response window."
                done
              />

              <TimelineItem
                time="5h 18m ago"
                title="Second automated follow-up"
                detail="Automated outreach sent. No venue response received."
                done
              />

              <TimelineItem
                time="Now"
                title="Human intervention recommended"
                detail="Escalated because SLA risk crossed the high-risk threshold."
                alert
                last
              />
            </div>
          </section>

          {/* Why */}
          <aside className="space-y-5">
            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Why human now?
              </p>

              <h3 className="mt-3 text-lg font-bold">
                Automation has reached diminishing returns.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                The venue normally responds in approximately 8 hours. After
                19.2 hours and two automated follow-ups, another automated
                message is less valuable than targeted human intervention.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Decision inputs
              </p>

              <div className="mt-4 space-y-3">
                <DecisionRow label="Elapsed time pressure" status="High" />
                <DecisionRow label="Follow-up saturation" status="High" />
                <DecisionRow label="Historical deviation" status="High" />
                <DecisionRow label="SLA proximity" status="Critical" />
              </div>
            </div>

            <Link
              href="/analyze"
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Proposal received?
              </p>

              <p className="mt-2 text-sm font-bold text-slate-900">
                Run Proposal Analyzer →
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Extract and validate commercial terms before planner review.
              </p>
            </Link>
          </aside>
        </div>

        <p className="py-8 text-center text-xs text-slate-400">
          Independent product engineering exploration · Not affiliated with
          Nowadays
        </p>
      </div>
    </main>
  );
}

function Signal({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="p-5">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function TimelineItem({
  time,
  title,
  detail,
  done = false,
  alert = false,
  last = false,
}: {
  time: string;
  title: string;
  detail: string;
  done?: boolean;
  alert?: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            alert
              ? "bg-red-100 text-red-700"
              : done
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          {alert ? "!" : "✓"}
        </div>

        {!last && <div className="h-16 w-px bg-slate-200" />}
      </div>

      <div className="pb-6">
        <p className="text-xs font-semibold text-slate-400">{time}</p>
        <p className="mt-1 text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function DecisionRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-slate-500">{label}</p>

      <span
        className={`rounded-lg px-2 py-1 text-xs font-bold ${
          status === "Critical"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}