import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/layout/AppShell.jsx";
import QuestionCard from "../components/simulation/QuestionCard.jsx";
import AnswerBox from "../components/simulation/AnswerBox.jsx";
import ScorePanel from "../components/simulation/ScorePanel.jsx";
import Card from "../components/ui/Card.jsx";
import { generateScenarios, runSimulation } from "../services/api.js";
import { scenarioBlueprints, sectorOptions } from "../services/mockData.js";
import { saveRun } from "../services/storage.js";
import {
  normalizeAllowedValue,
  validateSimulationAnswer,
  validateSimulationProfile,
} from "../services/validation.js";

const defaultProfile = {
  idea: "",
  sector: sectorOptions[0],
  budgetCurrency: "INR",
  budget: "200000",
  team: "3",
  goal: "",
};

function estimateLiveScore(answer) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const numericBoost = /\d/.test(answer) ? 8 : 0;
  return Math.max(42, Math.min(92, Math.round(36 + words * 0.9 + numericBoost)));
}

export default function Simulation() {
  const [phase, setPhase] = useState("setup");
  const [profile, setProfile] = useState(defaultProfile);
  const [scenarios, setScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previewScenarios = useMemo(
    () => scenarioBlueprints.map((item, index) => ({ ...item, id: `preview-${index + 1}` })),
    [],
  );

  const currentScenario = scenarios[currentIndex];
  const answeredCount = Object.values(answers).filter((value) => value.trim()).length;
  const liveScore = currentScenario ? estimateLiveScore(answers[currentScenario.id] ?? "") : 58;

  function sanitizeNumericInput(value) {
    return value.replace(/\D/g, "");
  }

  function formatBudget(profileValue) {
    return `${profileValue.budgetCurrency} ${profileValue.budget}`;
  }

  function formatTeam(profileValue) {
    return `${profileValue.team} ${profileValue.team === "1" ? "person" : "people"}`;
  }

  function buildSimulationProfile(profileValue) {
    return {
      ...profileValue,
      budget: formatBudget(profileValue),
      team: formatTeam(profileValue),
    };
  }

  function updateProfile(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handleGenerate() {
    const validationError = validateSimulationProfile(profile);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const simulationProfile = buildSimulationProfile(profile);
      const generatedScenarios = await generateScenarios(simulationProfile);
      setScenarios(generatedScenarios);
      setCurrentIndex(0);
      setAnswers({});
      setResult(null);
      setPhase("questions");
    } catch {
      setError("The scenario generator did not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvance() {
    const currentAnswer = answers[currentScenario.id]?.trim() ?? "";
    const validationError = validateSimulationAnswer(currentAnswer);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    setLoading(true);

    try {
      const simulationProfile = buildSimulationProfile(profile);
      const analysis = await runSimulation({
        profile: simulationProfile,
        scenarios,
        answers,
      });

      const completedRun = {
        id: `run-${Date.now()}`,
        createdAt: new Date().toISOString(),
        profile: simulationProfile,
        scenarios,
        answers,
        ...analysis,
      };

      setResult(completedRun);
      saveRun(completedRun);
      setPhase("results");
    } catch {
      setError("The analysis report could not be generated. Try the final step again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((value) => value - 1);
    setError("");
  }

  function handleReset() {
    setPhase("setup");
    setScenarios([]);
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setError("");
  }

  return (
    <AppShell
      title="Simulation"
      subtitle="Step through founder decisions, store every answer, and watch your startup readiness move in real time."
    >
      {phase === "setup" ? (
        <section className="setup-grid responsive-grid responsive-grid--sidebar">
          <Card>
            <span className="card-kicker">Venture Setup</span>
            <h2 className="card-title">Describe your venture before you begin.</h2>
            <p className="card-copy">
              Your idea, sector, budget, and team shape the scenario set and the final readiness report.
            </p>

            <div className="form-grid responsive-grid responsive-grid--two">
              <label className="field">
                <span>Startup idea</span>
                <textarea
                  required
                  minLength={18}
                  maxLength={400}
                  value={profile.idea}
                  onChange={(event) => updateProfile("idea", event.target.value)}
                  placeholder="Example: A platform connecting rural farmers with urban buyers through verified demand and pooled logistics"
                />
              </label>

              <label className="field">
                <span>Sector</span>
                <select
                  className="select--simulation"
                  required
                  value={profile.sector}
                  onChange={(event) =>
                    updateProfile(
                      "sector",
                      normalizeAllowedValue(event.target.value, sectorOptions, sectorOptions[0]),
                    )}
                >
                  {sectorOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Current budget</span>
                <div className="inline-field-group">
                  <select
                    className="inline-field-group__select"
                    value={profile.budgetCurrency}
                    onChange={(event) => updateProfile("budgetCurrency", event.target.value)}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={profile.budget}
                    onChange={(event) => updateProfile("budget", sanitizeNumericInput(event.target.value))}
                    placeholder="200000"
                  />
                </div>
              </label>

              <label className="field">
                <span>Team size</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={profile.team}
                  onChange={(event) => updateProfile("team", sanitizeNumericInput(event.target.value))}
                  placeholder="3"
                />
              </label>

              <label className="field field--full">
                <span>Focus area</span>
                <textarea
                  required
                  minLength={18}
                  maxLength={280}
                  value={profile.goal}
                  onChange={(event) => updateProfile("goal", event.target.value)}
                  placeholder="What do you want this run to stress-test: demand, finances, stakeholder trust, operations, or growth?"
                />
              </label>
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="action-row action-row--responsive">
              <button className="button button--primary" type="button" onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating scenarios..." : "Generate 8 Scenarios"}
              </button>
            </div>
          </Card>

          <ScorePanel
            phase="setup"
            scenarios={previewScenarios}
            currentIndex={0}
            answersCount={0}
            result={null}
            liveScore={58}
          />
        </section>
      ) : null}

      {phase === "questions" && currentScenario ? (
        <motion.section
          className="simulation-grid responsive-grid responsive-grid--three"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <QuestionCard
            scenario={currentScenario}
            index={currentIndex + 1}
            total={scenarios.length}
            answeredCount={answeredCount}
          />

          <AnswerBox
            answer={answers[currentScenario.id] ?? ""}
            onChange={(value) => {
              setAnswers((current) => ({ ...current, [currentScenario.id]: value }));
              setError("");
            }}
            onBack={handleBack}
            onNext={handleAdvance}
            isFirst={currentIndex === 0}
            isLast={currentIndex === scenarios.length - 1}
            isSubmitting={loading}
            error={error}
            liveScore={liveScore}
          />

          <ScorePanel
            phase="questions"
            scenarios={scenarios}
            currentIndex={currentIndex}
            answersCount={answeredCount}
            result={null}
            liveScore={liveScore}
          />
        </motion.section>
      ) : null}

      {phase === "results" && result ? (
        <section className="result-grid responsive-grid responsive-grid--sidebar">
          <Card>
            <span className="card-kicker">Readiness Report</span>
            <h2 className="card-title">{result.profile.idea}</h2>
            <p className="card-copy">{result.summary}</p>

            <div className="chip-row">
              <span className="chip">Score {result.weightedScore}</span>
              <span className="chip">Demand {result.demandScore}</span>
              <span className="chip">{result.profile.sector}</span>
              <span className="chip">{formatBudget(result.profile)}</span>
              <span className="chip">{formatTeam(result.profile)}</span>
            </div>

            <h3 className="section-title">Strengths</h3>
            <ul className="insight-list">
              {result.strengths.map((item) => (
                <li key={item} className="insight-item">{item}</li>
              ))}
            </ul>

            <h3 className="section-title">Weaknesses</h3>
            <ul className="insight-list">
              {result.weaknesses.map((item) => (
                <li key={item} className="insight-item">{item}</li>
              ))}
            </ul>

            <div className="action-row action-row--responsive">
              <button className="button button--ghost" type="button" onClick={handleReset}>
                Run Again
              </button>
              <Link className="button button--ghost" to="/my-startup">
                My Startup
              </Link>
              <Link className="button button--primary" to="/dashboard">
                Open Dashboard
              </Link>
            </div>
          </Card>

          <ScorePanel
            phase="results"
            scenarios={scenarios}
            currentIndex={currentIndex}
            answersCount={answeredCount}
            result={result}
            liveScore={result.weightedScore}
          />
        </section>
      ) : null}
    </AppShell>
  );
}

