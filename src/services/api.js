import axios from "axios";
import {
  communityFeed,
  dashboardFallback,
  governmentSchemes,
  messageThreads,
  scenarioBlueprints,
  settingsDefaults,
  startupCatalog,
} from "./mockData.js";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 6000,
});

const categorySignals = {
  Market: ["customer", "user", "buyer", "farmer", "student", "pain", "problem", "demand", "switch"],
  Money: ["price", "pricing", "revenue", "margin", "cash", "cost", "budget", "fee", "subscription"],
  Team: ["team", "hire", "skills", "partner", "ops", "founder", "role", "mentor"],
  Risk: ["risk", "fallback", "pilot", "test", "assumption", "failure", "learn", "mitigate"],
  Stakeholders: ["stakeholder", "trust", "partner", "school", "government", "community", "buyer", "farmer"],
  Impact: ["impact", "outcome", "measure", "track", "benefit", "income", "health", "education"],
  Scale: ["scale", "systems", "process", "operations", "quality", "expansion", "channel", "capacity"],
  Competition: ["competitor", "advantage", "moat", "distribution", "brand", "trust", "network", "defend"],
};

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function clampScore(value) {
  return Math.max(32, Math.min(96, Math.round(value)));
}

function countHits(text, words) {
  return words.reduce((total, word) => total + Number(text.includes(word)), 0);
}

function buildFallbackScenarios(profile) {
  const idea = profile.idea?.trim() || "your startup";
  const goal = profile.goal?.trim() || "the founder's current focus";

  return scenarioBlueprints.map((item, index) => ({
    id: `scenario-${index + 1}`,
    category: item.category,
    weight: item.weight,
    title: `${item.title} for ${idea}`,
    note: `${item.note} This run is tuned to the founder's focus on ${goal}.`,
    prompt: `${item.prompt(profile)} Keep your answer grounded in the venture idea "${idea}" and the focus area "${goal}".`,
  }));
}

function evaluateScenarioAnswer(category, answer) {
  const normalized = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const hitCount = countHits(normalized, categorySignals[category] ?? []);
  const numberBonus = /\d/.test(answer) ? 6 : 0;
  const depthBonus = Math.min(wordCount, 90) * 0.45;

  return clampScore(28 + depthBonus + hitCount * 6.2 + numberBonus);
}

function categoryRecommendation(category) {
  const recommendations = {
    Market: "Clarify the first user and the pain intense enough to trigger fast adoption.",
    Money: "Add the first revenue motion with a price point or explicit unit-economics logic.",
    Team: "Show how the founding team covers core delivery gaps without overbuilding too early.",
    Risk: "Name the biggest assumption and the cheapest experiment that would test it quickly.",
    Stakeholders: "Map who must trust you before the venture can move, then explain how you earn that trust.",
    Impact: "Turn the impact story into one measurable outcome you can track every month.",
    Scale: "Explain what breaks first when demand rises and what systems you build before expansion.",
    Competition: "State the one advantage that compounds and cannot be copied in a single quarter.",
  };

  return recommendations[category];
}

function buildFallbackAnalysis(payload) {
  const categoryScores = payload.scenarios.map((scenario) => ({
    category: scenario.category,
    weight: scenario.weight,
    value: evaluateScenarioAnswer(scenario.category, payload.answers[scenario.id] ?? ""),
  }));

  const weightedScore = Math.round(
    categoryScores.reduce((total, item) => total + item.value * (item.weight / 100), 0),
  );

  const strengths = categoryScores
    .filter((item) => item.value >= 76)
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)
    .map((item) => `${item.category} thinking feels comparatively strong.`);

  const weaknesses = categoryScores
    .filter((item) => item.value < 64)
    .sort((left, right) => left.value - right.value)
    .slice(0, 3)
    .map((item) => `${item.category} is still too vague for a confident real-world decision.`);

  const recommendations = categoryScores
    .slice()
    .sort((left, right) => left.value - right.value)
    .slice(0, 3)
    .map((item) => categoryRecommendation(item.category));

  const demandScore = clampScore(weightedScore * 0.78 + Object.keys(payload.answers).length * 1.8);
  const investorInterest = Math.max(1, Math.round((weightedScore + demandScore) / 18));
  const summary =
    weightedScore >= 82
      ? "This run shows a founder with a strong early model, clear learning instincts, and improving decision quality."
      : weightedScore >= 68
        ? "This run shows good promise, but some decisions still need sharper evidence before the venture looks investment ready."
        : "This run exposed useful gaps. The venture idea may still be strong, but the execution story needs more discipline and proof.";

  return {
    weightedScore,
    demandScore,
    investorInterest,
    categoryScores,
    strengths: strengths.length > 0 ? strengths : ["You covered enough detail to create a usable baseline for improvement."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["No major red flags, but the next run should include more specific evidence and numbers."],
    recommendations,
    summary,
    topAction: recommendations[0] ?? "Repeat the simulation and improve the weakest category first.",
  };
}

function buildFallbackInvestorFeedback(run) {
  const score = run.weightedScore;
  const investSignal = score >= 80 ? "Interested with conditions" : score >= 68 ? "Not yet, but watching closely" : "Pass for now";
  const tone =
    score >= 80
      ? "You are thinking like a serious founder, but I still need proof that the traction story is repeatable."
      : score >= 68
        ? "The ambition is real, but the business still sounds more hopeful than inevitable."
        : "The mission is compelling, but the current decisions do not yet reduce enough risk for investment.";

  return {
    investSignal,
    tone,
    questions: [
      `What evidence proves ${run.profile.idea} solves a painful enough problem to create repeat demand?`,
      `Which category from this run improves first if I give you three months and limited capital?`,
      "What does the first non-obvious moat look like once the idea gets copied?",
    ],
    yesTrigger: run.recommendations[0] ?? "Show clearer traction and stronger unit logic.",
    redFlag: run.weaknesses[0] ?? "The business case still feels too early.",
  };
}

export async function generateScenarios(profile) {
  await wait(220);
  return buildFallbackScenarios(profile);
}

export async function analyzeSimulation(payload) {
  await wait(360);
  return buildFallbackAnalysis(payload);
}

export async function runSimulation(payload) {
  await wait(360);
  return buildFallbackAnalysis(payload);
}

export async function getStartups() {
  await wait(180);
  return startupCatalog;
}

export async function getCommunityFeed() {
  await wait(180);
  return communityFeed;
}

export async function getFeed() {
  return getCommunityFeed();
}

export async function getInvestorFeedback(run) {
  await wait(180);
  return buildFallbackInvestorFeedback(run);
}

export async function getResources(filters = {}) {
  await wait(120);

  return governmentSchemes.filter((item) => {
    const sectorMatch = !filters.sector || filters.sector === "All" || item.sector === "General" || item.sector === filters.sector;
    const supportMatch = !filters.supportType || filters.supportType === "All" || item.supportType === filters.supportType;

    return sectorMatch && supportMatch;
  });
}

export async function getMessageThreads() {
  await wait(120);
  return messageThreads;
}

export async function getSettingsDefaults() {
  await wait(80);
  return settingsDefaults;
}

export function getDashboardFallback() {
  return dashboardFallback;
}

export { apiClient };

