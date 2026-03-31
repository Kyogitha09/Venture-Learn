import { sectorOptions } from "./mockData.js";

export const accountTypes = ["owner", "investor", "user"];
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordPattern = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hasMinimumLength(value, length) {
  return value.trim().length >= length;
}

export function validateEmail(email) {
  if (!email?.trim()) {
    return "Email is required.";
  }

  if (!emailPattern.test(email.trim().toLowerCase())) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validatePassword(password) {
  if (!password?.trim()) {
    return "Password is required.";
  }

  if (!passwordPattern.test(password)) {
    return "Password must be at least 8 characters and include one number and one special character.";
  }

  return "";
}

export function validateLinkedInUrl(url) {
  if (!url?.trim()) {
    return "LinkedIn URL is required for investor accounts.";
  }

  if (!linkedInPattern.test(url.trim())) {
    return "Enter a valid LinkedIn profile URL.";
  }

  return "";
}

export function validateLoginForm(form) {
  if (!accountTypes.includes(form?.userType)) {
    return "Select whether you want to sign in as a startup, investor, or user.";
  }

  if (!form?.email?.trim() || !form?.password?.trim()) {
    return "Complete the form first to continue.";
  }

  return validateEmail(form.email) || validatePassword(form.password);
}

export function validateRegistrationForm(form) {
  if (!accountTypes.includes(form?.userType)) {
    return "Select whether you are joining as a startup, investor, or user.";
  }

  if (form?.userType === "user") {
    if (!hasMinimumLength(form?.firstName ?? "", 2)) {
      return "Enter your first name.";
    }

    if (!hasMinimumLength(form?.lastName ?? "", 2)) {
      return "Enter your last name.";
    }
  } else if (!hasMinimumLength(form?.name ?? "", 2)) {
    return "Enter your full name.";
  }

  if (form?.userType !== "user") {
    if (!hasMinimumLength(form?.role ?? "", 2)) {
      return "Enter your role.";
    }

    if (!hasMinimumLength(form?.organization ?? "", 2)) {
      return "Enter your organization name.";
    }
  }

  const emailError = validateEmail(form?.email ?? "");
  if (emailError) {
    return emailError;
  }

  const passwordError = validatePassword(form?.password ?? "");
  if (passwordError) {
    return passwordError;
  }

  if (!form?.confirmPassword?.trim()) {
    return "Confirm your password to continue.";
  }

  if (form.password !== form.confirmPassword) {
    return "Passwords do not match.";
  }

  if (form.userType === "investor") {
    const linkedInError = validateLinkedInUrl(form.linkedinUrl ?? "");
    if (linkedInError) {
      return linkedInError;
    }
  }

  return "";
}

export function validateSimulationProfile(profile) {
  if (!hasMinimumLength(profile?.idea ?? "", 18)) {
    return "Add a clearer startup idea with a little more detail before continuing.";
  }

  if (!sectorOptions.includes(profile?.sector)) {
    return "Choose a valid sector for the simulation.";
  }

  if (!profile?.budgetCurrency?.trim()) {
    return "Choose a budget currency before generating scenarios.";
  }

  if (!profile?.budget?.trim()) {
    return "Add your current budget before generating scenarios.";
  }

  if (!/^\d+$/.test(profile.budget.trim())) {
    return "Budget should contain numbers only.";
  }

  if (!profile?.team?.trim()) {
    return "Add your current team size before generating scenarios.";
  }

  if (!/^\d+$/.test(profile.team.trim())) {
    return "Team size should contain numbers only.";
  }

  if (!hasMinimumLength(profile?.goal ?? "", 18)) {
    return "Describe the focus area you want this run to test.";
  }

  return "";
}

export function validateSimulationAnswer(answer) {
  if (!answer?.trim()) {
    return "Write your decision before moving forward.";
  }

  if (wordCount(answer) < 12) {
    return "Add a bit more detail so the decision and trade-off are clear.";
  }

  return "";
}

export function validateInvestorInterestPayload({ startup, investor }) {
  if (investor?.userType !== "investor") {
    return "Only investor accounts can express interest in startups.";
  }

  if (!startup?.id || !startup?.idea || !startup?.founder) {
    return "This startup entry is incomplete and cannot be saved yet.";
  }

  if (!hasMinimumLength(investor?.organization ?? "", 2)) {
    return "Add a valid organization name to your investor profile first.";
  }

  const linkedInError = validateLinkedInUrl(investor?.linkedinUrl ?? "");
  if (linkedInError) {
    return linkedInError;
  }

  return "";
}

export function normalizeAllowedValue(value, allowedValues, fallback) {
  return allowedValues.includes(value) ? value : fallback;
}
