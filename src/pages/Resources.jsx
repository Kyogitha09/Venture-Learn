import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import { GOVERNMENT_SCHEMES } from "../services/mockData.js";
import { getSessionUser } from "../services/storage.js";

export default function Resources() {
  const user = getSessionUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const categories = useMemo(
    () => ["All", ...new Set(GOVERNMENT_SCHEMES.map((item) => item.category))],
    [],
  );

  const filteredSchemes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return GOVERNMENT_SCHEMES.filter((scheme) => {
      const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        scheme.name.toLowerCase().includes(normalizedQuery) ||
        scheme.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  function toggleBookmark(id) {
    setBookmarkedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <AppShell
      title="Government Schemes"
      subtitle="Browse startup support programs, search by need, filter by category, and bookmark the schemes you want to revisit."
      actions={<span className="status-pill">{bookmarkedIds.length} bookmarked</span>}
    >
      <section className="schemes-hero">
        <Card className="schemes-hero-card">
          <div className="schemes-hero__header">
            <div>
              <span className="card-kicker">Startup Funding Navigator</span>
              <h2 className="card-title">Find the right public support for your startup.</h2>
              <p className="card-copy">
                {user?.name ? `${user.name}, ` : ""}
                search grant and funding pathways, narrow them by category, and bookmark the schemes worth applying to next.
              </p>
            </div>

            <div className="schemes-stats">
              <div className="schemes-stat">
                <strong>{GOVERNMENT_SCHEMES.length}</strong>
                <span>Total schemes</span>
              </div>
              <div className="schemes-stat">
                <strong>{categories.length - 1}</strong>
                <span>Categories</span>
              </div>
              <div className="schemes-stat">
                <strong>{bookmarkedIds.length}</strong>
                <span>Bookmarked</span>
              </div>
            </div>
          </div>

          <div className="schemes-toolbar">
            <label className="field">
              <span>Search schemes</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by scheme name or description"
              />
            </label>

            <div className="schemes-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? "schemes-chip is-active" : "schemes-chip"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="page-section">
        {filteredSchemes.length === 0 ? (
          <Card>
            <div className="schemes-empty">
              <strong>No schemes match your filter</strong>
              <p className="card-copy">Try a different keyword or switch to another category.</p>
            </div>
          </Card>
        ) : (
          <div className="schemes-grid">
            {filteredSchemes.map((scheme) => {
              const isBookmarked = bookmarkedIds.includes(scheme.id);

              return (
                <Card key={scheme.id} className="scheme-card">
                  <div className="scheme-card__top">
                    <span className="scheme-badge">{scheme.category}</span>
                    <button
                      type="button"
                      className="scheme-bookmark"
                      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      onClick={() => toggleBookmark(scheme.id)}
                    >
                      {isBookmarked ? "🔖" : "📑"}
                    </button>
                  </div>

                  <h2 className="card-title">{scheme.name}</h2>
                  <p className="card-copy scheme-description">{scheme.description}</p>

                  <div className="scheme-detail-list">
                    <div className="scheme-detail">
                      <span>Amount</span>
                      <strong>{scheme.amount}</strong>
                    </div>
                    <div className="scheme-detail">
                      <span>Eligibility</span>
                      <strong>{scheme.eligibility}</strong>
                    </div>
                    <div className="scheme-detail">
                      <span>Deadline</span>
                      <strong>{scheme.deadline}</strong>
                    </div>
                  </div>

                  <a
                    className="button button--primary scheme-cta"
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apply via {scheme.state} Portal
                  </a>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}

