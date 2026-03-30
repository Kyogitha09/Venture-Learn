import {
  accountTypes,
  validateEmail,
  validateInvestorInterestPayload,
  validateLinkedInUrl,
  validatePassword,
  validateSimulationProfile,
} from "./validation.js";

const RUNS_KEY = "venturelearn-runs";
const USER_KEY = "venturelearn-user";
const USERS_KEY = "venturelearn-users";
const INVESTMENT_INTEREST_KEY = "venturelearn-investment-interest";
const VERIFIED_STARTUPS_KEY = "venturelearn-verified-startups";
const USER_PREFERENCES_KEY = "venturelearn-user-preferences";
const STARTUP_VIEWS_KEY = "venturelearn-startup-views";
const STARTUP_SUGGESTIONS_KEY = "venturelearn-startup-suggestions";
const STARTUP_LIKES_KEY = "venturelearn-startup-likes";

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function toSessionUser(user) {
  const normalizedEmail = normalizeEmail(user.email ?? "");

  return {
    id: user.id ?? `${user.userType || "user"}-${normalizedEmail || "member"}`,
    name: user.name?.trim() || "Founder",
    email: normalizedEmail,
    organization: user.organization?.trim() || "",
    role: user.role?.trim() || "",
    userType: user.userType || "owner",
    linkedinUrl: user.linkedinUrl?.trim() || "",
    createdAt: user.createdAt ?? new Date().toISOString(),
  };
}

function readStoredList(key) {
  if (!canUseStorage()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadUsers() {
  return readStoredList(USERS_KEY);
}

export function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  return loadUsers().find((item) => normalizeEmail(item.email ?? "") === normalized) ?? null;
}

export function registerUser(user) {
  if (!canUseStorage()) {
    return { ok: false, reason: "storage" };
  }

  if (!accountTypes.includes(user.userType || "owner")) {
    return { ok: false, reason: "type" };
  }

  if (validateEmail(user.email) || validatePassword(user.password)) {
    return { ok: false, reason: "invalid" };
  }

  const normalizedUserType = user.userType || "owner";
  const resolvedName = user.name?.trim() || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  if (!resolvedName) {
    return { ok: false, reason: "invalid" };
  }

  if (normalizedUserType !== "user" && (!user.role?.trim() || !user.organization?.trim())) {
    return { ok: false, reason: "invalid" };
  }

  if (normalizedUserType === "investor" && validateLinkedInUrl(user.linkedinUrl ?? "")) {
    return { ok: false, reason: "linkedin" };
  }

  if (findUserByEmail(user.email)) {
    return { ok: false, reason: "exists" };
  }

  const nextUser = {
    id: user.id ?? `${user.userType || "user"}-${Date.now()}`,
    name: resolvedName,
    firstName: user.firstName?.trim() || "",
    lastName: user.lastName?.trim() || "",
    email: normalizeEmail(user.email ?? ""),
    organization: normalizedUserType === "user" ? "" : user.organization?.trim() || "",
    role: normalizedUserType === "user" ? "" : user.role?.trim() || "",
    userType: normalizedUserType,
    linkedinUrl: user.linkedinUrl?.trim() || "",
    password: user.password ?? "",
    createdAt: new Date().toISOString(),
  };

  const users = loadUsers();
  window.localStorage.setItem(USERS_KEY, JSON.stringify([nextUser, ...users]));

  return {
    ok: true,
    user: toSessionUser(nextUser),
  };
}

export function authenticateUser(email, password, userType) {
  if (!accountTypes.includes(userType || "")) {
    return { ok: false, reason: "type" };
  }

  if (validateEmail(email) || validatePassword(password)) {
    return { ok: false, reason: "invalid" };
  }

  const existingUser = findUserByEmail(email);

  if (!existingUser) {
    return { ok: false, reason: "missing" };
  }

  if (existingUser.password !== password) {
    return { ok: false, reason: "password" };
  }

  if ((existingUser.userType || "owner") !== userType) {
    return { ok: false, reason: "type" };
  }

  return {
    ok: true,
    user: toSessionUser(existingUser),
  };
}

export function loadRuns() {
  const currentUser = getSessionUser();

  if (!currentUser) {
    return [];
  }

  return loadAllRuns().filter((item) => item.ownerEmail === currentUser.email);
}

export function loadAllRuns() {
  return readStoredList(RUNS_KEY);
}

export function saveRun(run) {
  if (!canUseStorage()) {
    return [];
  }

  const currentUser = getSessionUser();

  if (!currentUser || currentUser.userType !== "owner" || validateSimulationProfile(run?.profile ?? {})) {
    return loadAllRuns();
  }

  const history = loadAllRuns();
  const nextRun = {
    id: run.id ?? `run-${Date.now()}`,
    ownerEmail: currentUser?.email ?? "",
    ownerName: currentUser?.name ?? "Founder",
    ownerOrganization: currentUser?.organization || "",
    ownerRole: currentUser?.role || "",
    ...run,
  };
  const nextHistory = [nextRun, ...history].slice(0, 24);

  window.localStorage.setItem(RUNS_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function getLatestRun() {
  return loadRuns()[0] ?? null;
}

export function loadInvestmentInterests() {
  return readStoredList(INVESTMENT_INTEREST_KEY);
}

export function loadVerifiedStartups() {
  return readStoredList(VERIFIED_STARTUPS_KEY);
}

export function recordStartupView({ startup, user }) {
  if (!canUseStorage()) {
    return null;
  }

  const normalizedEmail = normalizeEmail(user?.email ?? "");

  if (!normalizedEmail || !startup?.id) {
    return null;
  }

  const existing = readStoredList(STARTUP_VIEWS_KEY);
  const nextRecord = {
    id: `view-${startup.id}-${Date.now()}`,
    startupId: startup.id,
    startupName: startup.name ?? startup.idea ?? "Startup",
    startupFounder: startup.founder ?? "",
    startupSector: startup.sector ?? "",
    startupSummary: startup.summary ?? startup.pitch ?? "",
    userEmail: normalizedEmail,
    userType: user?.userType ?? "user",
    viewedAt: new Date().toISOString(),
  };

  const filtered = existing.filter(
    (item) => !(item.startupId === startup.id && item.userEmail === normalizedEmail),
  );
  const nextList = [nextRecord, ...filtered].slice(0, 50);
  window.localStorage.setItem(STARTUP_VIEWS_KEY, JSON.stringify(nextList));
  return nextRecord;
}

export function loadUserStartupViews(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  return readStoredList(STARTUP_VIEWS_KEY).filter((item) => item.userEmail === normalizedEmail);
}

export function hasUserStartupView(startupId, email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  return readStoredList(STARTUP_VIEWS_KEY).some(
    (item) => item.startupId === startupId && item.userEmail === normalizedEmail,
  );
}

export function saveStartupSuggestion({ startup, user, text }) {
  if (!canUseStorage()) {
    return null;
  }

  const normalizedEmail = normalizeEmail(user?.email ?? "");
  const trimmedText = text?.trim() ?? "";

  if (!normalizedEmail || !startup?.id || !trimmedText) {
    return null;
  }

  const existing = readStoredList(STARTUP_SUGGESTIONS_KEY);
  const nextRecord = {
    id: `suggestion-${Date.now()}`,
    startupId: startup.id,
    startupName: startup.name ?? startup.idea ?? "Startup",
    startupFounder: startup.founder ?? "",
    startupSector: startup.sector ?? "",
    startupSummary: startup.summary ?? startup.pitch ?? "",
    suggestion: trimmedText,
    userEmail: normalizedEmail,
    userName: user?.name?.trim() || "You",
    userType: user?.userType ?? "user",
    createdAt: new Date().toISOString(),
  };

  const nextList = [nextRecord, ...existing].slice(0, 100);
  window.localStorage.setItem(STARTUP_SUGGESTIONS_KEY, JSON.stringify(nextList));
  return nextRecord;
}

export function loadUserStartupSuggestions(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  return readStoredList(STARTUP_SUGGESTIONS_KEY).filter((item) => item.userEmail === normalizedEmail);
}

export function hasUserStartupLike(startupId, email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  return readStoredList(STARTUP_LIKES_KEY).some(
    (item) => item.startupId === startupId && item.userEmail === normalizedEmail,
  );
}

export function toggleStartupLike({ startup, user }) {
  if (!canUseStorage()) {
    return { ok: false, active: false };
  }

  const normalizedEmail = normalizeEmail(user?.email ?? "");

  if (!normalizedEmail || !startup?.id) {
    return { ok: false, active: false };
  }

  const existing = readStoredList(STARTUP_LIKES_KEY);
  const alreadyLiked = existing.some(
    (item) => item.startupId === startup.id && item.userEmail === normalizedEmail,
  );

  if (alreadyLiked) {
    const filtered = existing.filter(
      (item) => !(item.startupId === startup.id && item.userEmail === normalizedEmail),
    );
    window.localStorage.setItem(STARTUP_LIKES_KEY, JSON.stringify(filtered));
    return { ok: true, active: false };
  }

  const nextRecord = {
    id: `like-${startup.id}-${Date.now()}`,
    startupId: startup.id,
    startupName: startup.name ?? startup.idea ?? "Startup",
    startupFounder: startup.founder ?? "",
    startupSector: startup.sector ?? "",
    startupSummary: startup.summary ?? startup.pitch ?? "",
    userEmail: normalizedEmail,
    userName: user?.name?.trim() || "You",
    userType: user?.userType ?? "user",
    createdAt: new Date().toISOString(),
  };

  const nextList = [nextRecord, ...existing].slice(0, 100);
  window.localStorage.setItem(STARTUP_LIKES_KEY, JSON.stringify(nextList));
  return { ok: true, active: true, record: nextRecord };
}

export function loadUserStartupLikes(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  return readStoredList(STARTUP_LIKES_KEY).filter((item) => item.userEmail === normalizedEmail);
}

export function loadStartupLikesByIds(startupIds) {
  const allowedIds = new Set((startupIds ?? []).filter(Boolean));
  return readStoredList(STARTUP_LIKES_KEY).filter((item) => allowedIds.has(item.startupId));
}

export function loadStartupSuggestionsByIds(startupIds) {
  const allowedIds = new Set((startupIds ?? []).filter(Boolean));
  return readStoredList(STARTUP_SUGGESTIONS_KEY).filter((item) => allowedIds.has(item.startupId));
}

export function hasInvestorInterest(startupId, investorEmail) {
  return loadInvestmentInterests().some(
    (item) => item.startupId === startupId && item.investorEmail === normalizeEmail(investorEmail ?? ""),
  );
}

export function expressInvestorInterest({ startup, investor }) {
  if (!canUseStorage()) {
    return { ok: false, reason: "storage" };
  }

  const payloadError = validateInvestorInterestPayload({ startup, investor });

  if (payloadError) {
    return { ok: false, reason: "invalid", message: payloadError };
  }

  const normalizedInvestorEmail = normalizeEmail(investor?.email ?? "");

  if (!normalizedInvestorEmail) {
    return { ok: false, reason: "invalid" };
  }

  if (hasInvestorInterest(startup.id, normalizedInvestorEmail)) {
    return { ok: false, reason: "exists" };
  }

  const nextRecord = {
    id: `interest-${Date.now()}`,
    investorId: investor?.id ?? `investor-${normalizedInvestorEmail}`,
    startupId: startup.id,
    startupIdea: startup.idea,
    startupFounder: startup.founder,
    startupFounderEmail: startup.founderEmail ?? "",
    startupOrganization: startup.organization ?? "",
    startupSector: startup.sector,
    startupScore: startup.score,
    startupSummary: startup.summary,
    investorEmail: normalizedInvestorEmail,
    investorName: investor.name?.trim() || "Investor",
    investorRole: investor.role?.trim() || "",
    investorOrganization: investor.organization?.trim() || "",
    investorLinkedinUrl: investor.linkedinUrl?.trim() || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const records = loadInvestmentInterests();
  const nextRecords = [nextRecord, ...records];
  window.localStorage.setItem(INVESTMENT_INTEREST_KEY, JSON.stringify(nextRecords));

  return {
    ok: true,
    record: nextRecord,
  };
}

export function hasStartupVerification(startupId, investorEmail) {
  return loadVerifiedStartups().some(
    (item) => item.startupId === startupId && item.investorEmail === normalizeEmail(investorEmail ?? ""),
  );
}

export function verifyStartupSafety({ startup, investor }) {
  if (!canUseStorage()) {
    return { ok: false, reason: "storage" };
  }

  const payloadError = validateInvestorInterestPayload({ startup, investor });

  if (payloadError) {
    return { ok: false, reason: "invalid", message: payloadError };
  }

  const normalizedInvestorEmail = normalizeEmail(investor?.email ?? "");

  if (!normalizedInvestorEmail) {
    return { ok: false, reason: "invalid" };
  }

  if (hasStartupVerification(startup.id, normalizedInvestorEmail)) {
    return { ok: false, reason: "exists" };
  }

  const nextRecord = {
    id: `verification-${Date.now()}`,
    startupId: startup.id,
    startupIdea: startup.idea,
    startupFounder: startup.founder,
    startupSector: startup.sector,
    startupScore: startup.score,
    investorEmail: normalizedInvestorEmail,
    investorName: investor.name?.trim() || "Investor",
    investorOrganization: investor.organization?.trim() || "",
    investorRole: investor.role?.trim() || "",
    status: "Verified Safe",
    createdAt: new Date().toISOString(),
  };

  const records = loadVerifiedStartups();
  const nextRecords = [nextRecord, ...records];
  window.localStorage.setItem(VERIFIED_STARTUPS_KEY, JSON.stringify(nextRecords));

  return {
    ok: true,
    record: nextRecord,
  };
}

export function countStartupVerifications(startupId) {
  return loadVerifiedStartups().filter((item) => item.startupId === startupId).length;
}

export function loadInvestorVerifiedStartups(investorEmail) {
  return loadVerifiedStartups().filter(
    (item) => item.investorEmail === normalizeEmail(investorEmail ?? ""),
  );
}

export function loadStartupInterests(startupId) {
  return loadInvestmentInterests().filter((item) => item.startupId === startupId);
}

export function loadInvestorPipeline(investorEmail) {
  return loadInvestmentInterests().filter(
    (item) => item.investorEmail === normalizeEmail(investorEmail ?? ""),
  );
}

export function isStartupInvested(startupId, investorEmail) {
  return loadInvestmentInterests().some(
    (item) =>
      item.startupId === startupId &&
      item.investorEmail === normalizeEmail(investorEmail ?? "") &&
      item.status === "invested",
  );
}

export function markStartupAsInvested(startupId, investorEmail) {
  if (!canUseStorage()) {
    return { ok: false, reason: "storage" };
  }

  const normalizedInvestorEmail = normalizeEmail(investorEmail ?? "");
  const records = loadInvestmentInterests();
  const existingRecord = records.find(
    (item) => item.startupId === startupId && item.investorEmail === normalizedInvestorEmail,
  );

  if (!existingRecord) {
    return { ok: false, reason: "missing" };
  }

  if (existingRecord.status === "invested") {
    return { ok: false, reason: "exists" };
  }

  const nextRecords = records.map((item) =>
    item.startupId === startupId && item.investorEmail === normalizedInvestorEmail
      ? {
          ...item,
          status: "invested",
          investedAt: new Date().toISOString(),
        }
      : item,
  );

  window.localStorage.setItem(INVESTMENT_INTEREST_KEY, JSON.stringify(nextRecords));

  return {
    ok: true,
    record: nextRecords.find(
      (item) => item.startupId === startupId && item.investorEmail === normalizedInvestorEmail,
    ),
  };
}

export function removeInvestorInterest(startupId, investorEmail) {
  if (!canUseStorage()) {
    return { ok: false, reason: "storage" };
  }

  const normalizedInvestorEmail = normalizeEmail(investorEmail ?? "");
  const records = loadInvestmentInterests();
  const existingRecord = records.find(
    (item) => item.startupId === startupId && item.investorEmail === normalizedInvestorEmail,
  );

  if (!existingRecord) {
    return { ok: false, reason: "missing" };
  }

  const nextRecords = records.filter(
    (item) => !(item.startupId === startupId && item.investorEmail === normalizedInvestorEmail),
  );

  window.localStorage.setItem(INVESTMENT_INTEREST_KEY, JSON.stringify(nextRecords));

  return {
    ok: true,
    record: existingRecord,
  };
}

export function getSessionUser() {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue =
    window.localStorage.getItem(USER_KEY) ??
    (typeof window.sessionStorage !== "undefined" ? window.sessionStorage.getItem(USER_KEY) : null);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSessionUser(user) {
  if (!canUseStorage()) {
    return null;
  }

  const nextUser = {
    ...toSessionUser(user),
    mode: user.mode || "login",
  };

  window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

  return nextUser;
}

export function clearSessionUser() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(USER_KEY);

  if (typeof window.sessionStorage !== "undefined") {
    window.sessionStorage.removeItem(USER_KEY);
  }
}

export function updateSessionUserProfile(nextFields) {
  if (!canUseStorage()) {
    return null;
  }

  const currentUser = getSessionUser();

  if (!currentUser) {
    return null;
  }

  const nextUser = {
    ...currentUser,
    name: nextFields.name?.trim() || currentUser.name,
    role: nextFields.role?.trim() || currentUser.role,
    organization: nextFields.organization?.trim() || currentUser.organization,
    linkedinUrl: nextFields.linkedinUrl?.trim() || currentUser.linkedinUrl,
  };

  window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

  const users = loadUsers().map((item) =>
    normalizeEmail(item.email ?? "") === normalizeEmail(currentUser.email ?? "")
      ? { ...item, ...nextUser }
      : item,
  );

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return nextUser;
}

export function loadUserPreferences(email) {
  const allPreferences = readStoredList(USER_PREFERENCES_KEY);
  return allPreferences.find((item) => item.email === normalizeEmail(email ?? ""))?.preferences ?? {};
}

export function saveUserPreferences(email, preferences) {
  if (!canUseStorage()) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email ?? "");
  const existing = readStoredList(USER_PREFERENCES_KEY);
  const nextRecord = {
    email: normalizedEmail,
    preferences,
  };
  const filtered = existing.filter((item) => item.email !== normalizedEmail);
  const nextList = [nextRecord, ...filtered];
  window.localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(nextList));
  return nextRecord;
}
