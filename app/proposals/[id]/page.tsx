"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CompletenessResult = {
  score: number;
  verified_fields: string[];
  missing_fields: string[];
};

const proposalData = {
  room_rate: "$389 / night",
  room_block: "140 rooms",
  meeting_space: "18,500 sq ft",
  fnb_minimum: "$42,000",
  resort_fee: "$45 / room / night",
  cancellation_terms: null,
  deposit_schedule: "25% at signing",
  av_minimum: null,
  concessions: "1 per 40 comp room ratio",
  expiration_date: "August 20, 2026",
};

const proposalFields = [
  {
    label: "Guest room rate",
    value: "$389 / night",
    status: "verified",
    confidence: 98,
  },
  {
    label: "Room block",
    value: "140 rooms",
    status: "verified",
    confidence: 97,
  },
  {
    label: "Meeting space",
    value: "18,500 sq ft",
    status: "verified",
    confidence: 94,
  },
  {
    label: "Food & beverage minimum",
    value: "$42,000",
    status: "verified",
    confidence: 96,
  },
  {
    label: "Resort fee",
    value: "$45 / room / night",
    status: "verified",
    confidence: 93,
  },
  {
    label: "Deposit schedule",
    value: "25% at signing",
    status: "verified",
    confidence: 91,
  },
  {
    label: "Cancellation terms",
    value: "Not detected",
    status: "missing",
    confidence: 0,
  },
  {
    label: "AV minimum",
    value: "Not detected",
    status: "missing",
    confidence: 0,
  },
  {
    label: "Concessions",
    value: "1 per 40 comp room ratio",
    status: "verified",
    confidence: 89,
  },
  {
    label: "Proposal expiration",
    value: "August 20, 2026",
    status: "verified",
    confidence: 95,
  },
];

export default function ProposalDetail() {
  const [analysis, setAnalysis] = useState<CompletenessResult | null>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    async function analyzeProposal() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/score/completeness`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(proposalData),
          }
        );

        if (!response.ok) {
          throw new Error("Proposal analysis failed");
        }

        const result: CompletenessResult = await response.json();
        setAnalysis(result);
    } catch (error) {
        console.error(error);
        setApiError(true);
    }
}
    analyzeProposal();
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
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold text-slate-400">
              PROPOSAL INTELLIGENCE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Grand Hyatt Playa del Carmen
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Acme Leadership Retreat · Playa del Carmen, Mexico
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Completeness
            </p>

            <div className="mt-1 flex items-end gap-2">
              <p className="text-3xl font-bold text-amber-800">
                {apiError
                ? "API error"
                : analysis
                ? `${analysis.score}%`
                : "Analyzing..."}
                </p>
              <p className="pb-1 text-sm font-medium text-amber-700">
                needs review
              </p>
            </div>
          </div>
        </div>

        {/* AI Assessment */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              AI
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Proposal assessment
              </p>

              <h2 className="mt-2 text-lg font-bold">
                Human review recommended
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                This proposal contains most core commercial terms, but two
                contract-critical fields could not be reliably identified.
                Cancellation terms and the AV minimum should be confirmed
                before comparing this proposal against competing venues.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  Missing cancellation terms
                </span>

                <span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  Missing AV minimum
                </span>

                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  8 fields verified
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Extracted Terms */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="font-bold">Extracted proposal terms</h2>
              <p className="mt-1 text-xs text-slate-400">
                Structured from the venue proposal and checked for required
                fields.
              </p>
            </div>

            <div>
              {proposalFields.map((field) => (
                <div
                  key={field.label}
                  className="grid gap-3 border-b border-slate-100 px-6 py-4 last:border-0 sm:grid-cols-[220px_1fr_120px]"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {field.label}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      field.status === "missing"
                        ? "text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    {field.value}
                  </p>

                  <div className="sm:text-right">
                    {field.status === "verified" ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        ✓ {field.confidence}% confidence
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-red-600">
                        ⚠ Missing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action panel */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recommended action
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Request missing terms
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Ask the venue to confirm cancellation terms and the minimum AV
                commitment before planner review.
              </p>

              <button className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Generate follow-up
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Processing
              </p>

              <div className="mt-5 space-y-5">
                <ProcessStep
                  label="Proposal received"
                  detail="Aug 13 · 9:14 AM"
                  done
                />

                <ProcessStep
                  label="Terms extracted"
                  detail="10 fields analyzed"
                  done
                />

                <ProcessStep
                  label="Validation completed"
                  detail="2 issues detected"
                  done
                />

                <ProcessStep
                  label="Human review"
                  detail="Waiting for action"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Why this was flagged
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Commercial proposals should be complete enough to compare
                venues consistently. Missing contract terms can create false
                equivalence between otherwise similar quotes.
              </p>
            </div>
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

function ProcessStep({
  label,
  detail,
  done = false,
}: {
  label: string;
  detail: string;
  done?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          done
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {done ? "✓" : "!"}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  );
}