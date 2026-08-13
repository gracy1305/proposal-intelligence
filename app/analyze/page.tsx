"use client";

import Link from "next/link";
import { useState } from "react";

type AnalysisResult = {
  extracted_fields: Record<string, string | null>;
  completeness: {
    score: number;
    verified_fields: string[];
    missing_fields: string[];
  };
};

const sampleProposal = `Grand Hyatt Playa del Carmen Proposal

Guest Room Rate: $389 per night
Room Block: 140 rooms
Meeting Space: 18,500 sq ft
Food & Beverage Minimum: $42,000
Resort Fee: $45 per night
Deposit Schedule: 25% at signing
Concessions: 1 per 40 comp room ratio
Proposal Expires: August 20, 2026`;

const fieldLabels: Record<string, string> = {
  room_rate: "Guest room rate",
  room_block: "Room block",
  meeting_space: "Meeting space",
  fnb_minimum: "Food & beverage minimum",
  resort_fee: "Resort fee",
  cancellation_terms: "Cancellation terms",
  deposit_schedule: "Deposit schedule",
  av_minimum: "AV minimum",
  concessions: "Concessions",
  expiration_date: "Proposal expiration",
};

export default function AnalyzeProposalPage() {
  const [proposalText, setProposalText] = useState(sampleProposal);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://proposal-intelligence-api.onrender.com";

  async function analyzeProposal() {
    if (!proposalText.trim()) {
      setError("Paste proposal text before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/analyze/proposal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: proposalText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Analysis request failed");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not reach the Proposal Intelligence API. Make sure FastAPI is running on port 8001."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-lg font-bold tracking-tight">
              Proposal Intelligence
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              RFP reliability engine
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Proposal Pipeline
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Intro */}
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Proposal Analyzer
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Turn messy venue proposals into
            <br />
            structured decisions.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Extract commercial terms, identify missing information, and
            calculate an explainable proposal completeness score before a
            planner reviews the quote.
          </p>
        </div>

        {/* Main workspace */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          {/* Input */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold">Venue proposal</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Paste raw proposal text below.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProposalText(sampleProposal);
                    setResult(null);
                    setError("");
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                >
                  Load sample
                </button>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={proposalText}
                onChange={(event) => setProposalText(event.target.value)}
                className="min-h-[430px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="Paste hotel proposal text here..."
              />

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={analyzeProposal}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing proposal..." : "Analyze proposal →"}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Extraction is deterministic and the completeness score is
                calculated from explicit field weights.
              </p>
            </div>
          </section>

          {/* Results */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {!result ? (
              <div className="flex min-h-[620px] items-center justify-center p-10 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                    ◎
                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    Ready to analyze
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Run the proposal through the extraction service to see
                    structured commercial terms and missing-field detection.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Score */}
                <div className="border-b border-slate-100 p-6">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Analysis complete
                      </p>

                      <h2 className="mt-2 text-xl font-bold">
                        Proposal requires{" "}
                        {result.completeness.score < 80
                          ? "human review"
                          : "standard review"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {result.completeness.verified_fields.length} of{" "}
                        {Object.keys(result.extracted_fields).length} required
                        commercial fields were detected.
                      </p>
                    </div>

                    <div
                      className={`min-w-32 rounded-2xl border px-5 py-4 text-center ${
                        result.completeness.score < 80
                          ? "border-amber-200 bg-amber-50"
                          : "border-emerald-200 bg-emerald-50"
                      }`}
                    >
                      <p
                        className={`text-3xl font-bold ${
                          result.completeness.score < 80
                            ? "text-amber-800"
                            : "text-emerald-800"
                        }`}
                      >
                        {result.completeness.score}%
                      </p>

                      <p
                        className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${
                          result.completeness.score < 80
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        Completeness
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.completeness.score < 80
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${result.completeness.score}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Missing fields */}
                {result.completeness.missing_fields.length > 0 && (
                  <div className="border-b border-slate-100 bg-red-50/50 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                      Human attention required
                    </p>

                    <p className="mt-2 text-sm font-semibold text-red-900">
                      {result.completeness.missing_fields.length} required
                      fields could not be detected.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.completeness.missing_fields.map((field) => (
                        <span
                          key={field}
                          className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                        >
                          ⚠ {fieldLabels[field] ?? field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted fields */}
                <div>
                  <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="text-sm font-bold">
                      Extracted commercial terms
                    </h3>
                  </div>

                  {Object.entries(result.extracted_fields).map(
                    ([field, value]) => (
                      <div
                        key={field}
                        className="grid gap-2 border-b border-slate-100 px-6 py-4 last:border-0 sm:grid-cols-[190px_1fr_100px]"
                      >
                        <p className="text-sm font-medium text-slate-500">
                          {fieldLabels[field] ?? field}
                        </p>

                        <p
                          className={`text-sm font-semibold ${
                            value ? "text-slate-900" : "text-red-600"
                          }`}
                        >
                          {value ?? "Not detected"}
                        </p>

                        <div className="sm:text-right">
                          {value ? (
                            <span className="text-xs font-bold text-emerald-600">
                              ✓ Detected
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-600">
                              ⚠ Missing
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        <p className="py-8 text-center text-xs text-slate-400">
          Independent product engineering exploration · Not affiliated with
          Nowadays
        </p>
      </div>
    </main>
  );
}
