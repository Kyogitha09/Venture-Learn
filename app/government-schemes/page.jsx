"use client";

import { useMemo, useState } from "react";
import { GOVERNMENT_SCHEMES } from "../data/government-schemes";

export default function GovernmentSchemesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState([]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(GOVERNMENT_SCHEMES.map((scheme) => scheme.category))];
    return ["All", ...uniqueCategories];
  }, []);

  const filteredSchemes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return GOVERNMENT_SCHEMES.filter((scheme) => {
      const matchesCategory =
        selectedCategory === "All" || scheme.category === selectedCategory;

      const matchesSearch =
        !normalizedQuery ||
        scheme.name.toLowerCase().includes(normalizedQuery) ||
        scheme.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  function handleBookmarkToggle(schemeId) {
    setBookmarkedSchemes((current) =>
      current.includes(schemeId)
        ? current.filter((id) => id !== schemeId)
        : [...current, schemeId],
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur xl:p-10 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_left,rgba(59,130,246,0.12),transparent_28%)]" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:border-sky-900 dark:bg-sky-950/70 dark:text-sky-300">
                  Public Funding Navigator
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Government Schemes
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                  Explore active startup, funding, and innovation schemes with fast search,
                  category filters, and personal bookmarks for later review.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-2xl font-semibold">{GOVERNMENT_SCHEMES.length}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Total schemes</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-2xl font-semibold">{categories.length - 1}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Categories</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-2xl font-semibold">{bookmarkedSchemes.length}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Bookmarked</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Search schemes
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by scheme name or description"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950"
                />
              </label>

              <div>
                <span className="mb-3 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Filter by category
                </span>
                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {categories.map((category) => {
                    const isActive = category === selectedCategory;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "border-sky-500 bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {filteredSchemes.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <div className="mx-auto max-w-md">
                <div className="text-4xl">🔍</div>
                <h2 className="mt-4 text-2xl font-semibold">No schemes match your filter</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Try a different keyword or switch to another category to discover more
                  government support programs.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredSchemes.map((scheme) => {
                const isBookmarked = bookmarkedSchemes.includes(scheme.id);

                return (
                  <article
                    key={scheme.id}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {scheme.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleBookmarkToggle(scheme.id)}
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                        className="rounded-full border border-slate-200 bg-white p-2 text-lg transition duration-200 hover:scale-105 hover:border-sky-400 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
                      >
                        {isBookmarked ? "🔖" : "📑"}
                      </button>
                    </div>

                    <div className="mt-5 flex-1">
                      <h2 className="text-xl font-semibold leading-tight tracking-tight">
                        {scheme.name}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {scheme.description}
                      </p>

                      <dl className="mt-5 space-y-3 text-sm">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                          <dt className="font-medium text-slate-500 dark:text-slate-400">Amount</dt>
                          <dd className="mt-1 text-slate-900 dark:text-slate-100">{scheme.amount}</dd>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                          <dt className="font-medium text-slate-500 dark:text-slate-400">Eligibility</dt>
                          <dd className="mt-1 line-clamp-2 text-slate-900 dark:text-slate-100">
                            {scheme.eligibility}
                          </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                            <dt className="font-medium text-slate-500 dark:text-slate-400">Deadline</dt>
                            <dd className="mt-1 text-slate-900 dark:text-slate-100">{scheme.deadline}</dd>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                            <dt className="font-medium text-slate-500 dark:text-slate-400">State</dt>
                            <dd className="mt-1 text-slate-900 dark:text-slate-100">{scheme.state}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>

                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus:ring-sky-950"
                    >
                      Apply via {scheme.state} Portal
                    </a>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
