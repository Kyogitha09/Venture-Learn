export const sectorOptions = [
  "Agriculture",
  "Education",
  "Health",
  "Climate",
  "Livelihoods",
  "Finance",
  "Civic Tech",
  "Women Empowerment",
];

export const scenarioBlueprints = [
  {
    category: "Market",
    weight: 18,
    title: "Customer demand stress test",
    note: "Checks whether the founder understands who urgently needs the solution and why they would switch.",
    prompt: ({ idea, sector }) =>
      `You are pitching "${idea}" in ${sector}. A potential early adopter says they already use an imperfect workaround. What exact pain makes them switch to your solution within the next 30 days?`,
  },
  {
    category: "Money",
    weight: 16,
    title: "Cash flow decision",
    note: "Tests whether the startup can survive early-stage financial pressure.",
    prompt: ({ budget }) =>
      `You only have ${budget} left for the next phase. What do you fund first, what do you delay, and how does that choice protect cash flow without slowing learning too much?`,
  },
  {
    category: "Team",
    weight: 14,
    title: "Execution capacity",
    note: "Measures whether the team can deliver without overpromising.",
    prompt: ({ team }) =>
      `Your current team size is ${team}. Which responsibilities stay in-house, what would you outsource, and how do you stop the team from becoming the bottleneck?`,
  },
  {
    category: "Risk",
    weight: 12,
    title: "Failure planning",
    note: "Looks for realistic thinking about operational, financial, and adoption risks.",
    prompt: ({ idea }) =>
      `Imagine the first version of ${idea} underperforms for six weeks. What is the most likely reason it fails early, and what correction would you make before spending more money?`,
  },
  {
    category: "Stakeholders",
    weight: 12,
    title: "Stakeholder navigation",
    note: "Challenges the founder to manage trust across users, partners, and institutions.",
    prompt: ({ sector }) =>
      `In ${sector}, one important stakeholder supports you but another is skeptical. Who are those stakeholders, what do they each care about, and how would you win both without losing focus?`,
  },
  {
    category: "Impact",
    weight: 10,
    title: "Social impact proof",
    note: "Checks whether impact claims are measurable instead of just inspirational.",
    prompt: ({ idea }) =>
      `If ${idea} works, what measurable social outcome improves first, how would you track it, and what result would convince you the venture is genuinely helping people?`,
  },
  {
    category: "Scale",
    weight: 10,
    title: "Growth pressure",
    note: "Examines whether the founder can grow without breaking quality or trust.",
    prompt: ({ sector }) =>
      `Suppose demand grows faster than expected. What part of your model breaks first when you try to scale in ${sector}, and how do you prepare for that before expansion?`,
  },
  {
    category: "Competition",
    weight: 8,
    title: "Competitive response",
    note: "Tests how the founder responds when larger players notice the opportunity.",
    prompt: ({ idea }) =>
      `A better-funded competitor copies the visible parts of ${idea}. What is the advantage they cannot copy quickly, and how do you make that advantage stronger over time?`,
  },
];

export const startupCatalog = [
  {
    id: "startup-1",
    name: "GrainLoop",
    pitch: "Verified demand pooling for rural producers selling directly to city buyers.",
    founder: "Aanya Sharma",
    organization: "GrainLoop Labs",
    sector: "Agriculture",
    simulationScore: 84,
    demandScore: 79,
    investorInterest: 12,
    category: "Marketplace",
    stage: "Pre-seed",
    summary: "Building a trust-first farm-to-city logistics layer with pooled delivery windows and buyer verification.",
  },
  {
    id: "startup-2",
    name: "MindMesh",
    pitch: "Peer-led mental wellness circles for students with structured escalation support.",
    founder: "Yash Kapoor",
    organization: "MindMesh Health",
    sector: "Health",
    simulationScore: 78,
    demandScore: 74,
    investorInterest: 8,
    category: "HealthTech",
    stage: "Pilot",
    summary: "A low-cost campus mental wellness network combining moderated circles, check-ins, and referral pathways.",
  },
  {
    id: "startup-3",
    name: "SolarPatch",
    pitch: "Repair routing and technician enablement for distributed solar equipment in tier-2 towns.",
    founder: "Sneha Rao",
    organization: "SolarPatch Services",
    sector: "Climate",
    simulationScore: 81,
    demandScore: 77,
    investorInterest: 10,
    category: "Climate",
    stage: "MVP",
    summary: "Extending solar asset life by connecting verified repair demand to trained local technicians.",
  },
  {
    id: "startup-4",
    name: "SkillBridge",
    pitch: "A skill-to-gig conversion pipeline for vocational institutes and local employers.",
    founder: "Kabir Mehta",
    organization: "SkillBridge Network",
    sector: "Livelihoods",
    simulationScore: 76,
    demandScore: 72,
    investorInterest: 6,
    category: "Future of Work",
    stage: "Early traction",
    summary: "Helping institutes convert training into paid apprenticeships with quality and placement visibility.",
  },
];

export const communityFeed = [
  {
    id: "peer-1",
    founder: "Aanya",
    founderRole: "Founder",
    idea: "Rural farmers selling directly to urban buyers",
    sector: "Agriculture",
    summary: "Building a trust layer for farm-to-city purchasing with simple logistics coordination.",
    score: 84,
    demandScore: 79,
    likes: 42,
    comments: 11,
    stage: "Simulation run 3",
    commentThread: [
      { id: "c-11", author: "Mehul", text: "The repeat-buyer angle feels especially strong.", time: "2h ago" },
      { id: "c-12", author: "Nisha", text: "Would love to see the district-by-district rollout plan.", time: "1h ago" },
    ],
  },
  {
    id: "peer-2",
    founder: "Yash",
    founderRole: "Founder",
    idea: "Affordable mental wellness circles for college students",
    sector: "Health",
    summary: "Peer-led sessions backed by structured check-ins and escalation pathways.",
    score: 78,
    demandScore: 73,
    likes: 35,
    comments: 9,
    stage: "Simulation run 2",
    commentThread: [
      { id: "c-21", author: "Ritu", text: "Strong need, especially if campus onboarding is simple.", time: "3h ago" },
    ],
  },
  {
    id: "peer-3",
    founder: "Sneha",
    founderRole: "Founder",
    idea: "Solar repair micro-franchise for tier-2 towns",
    sector: "Climate",
    summary: "Training local technicians and routing repair requests before hardware gets abandoned.",
    score: 81,
    demandScore: 76,
    likes: 31,
    comments: 7,
    stage: "Simulation run 4",
    commentThread: [
      { id: "c-31", author: "Aarav", text: "The unit economics look more believable than most climate pilots.", time: "5h ago" },
    ],
  },
  {
    id: "peer-4",
    founder: "Kabir",
    founderRole: "Founder",
    idea: "Skill-to-gig bridge for vocational students",
    sector: "Livelihoods",
    summary: "Helping institutes convert students into trackable paid apprenticeships with local employers.",
    score: 76,
    demandScore: 71,
    likes: 28,
    comments: 13,
    stage: "Simulation run 1",
    commentThread: [
      { id: "c-41", author: "Divya", text: "Would be useful to know which employer segment signs first.", time: "6h ago" },
    ],
  },
];

export const governmentSchemes = [
  {
    id: "scheme-1",
    name: "Startup India Seed Fund",
    sector: "General",
    supportType: "Grant / Seed Support",
    amountBand: "Up to 50L",
    organization: "Startup India",
    summary: "Early support for validation, prototype development, and market-entry preparation through selected incubators.",
    note: "Good for founders who need proof-of-concept capital before raising private money.",
  },
  {
    id: "scheme-2",
    name: "SIDBI Innovation Support",
    sector: "Finance",
    supportType: "Debt / Early Capital",
    amountBand: "25L-2Cr",
    organization: "SIDBI",
    summary: "Useful when the venture needs structured financial support and stronger business discipline.",
    note: "Best reviewed alongside updated eligibility on the official portal.",
  },
  {
    id: "scheme-3",
    name: "Atal Innovation Mission",
    sector: "Education",
    supportType: "Incubation / Grants",
    amountBand: "Varies",
    organization: "NITI Aayog",
    summary: "Supports innovation-led problem solving, incubation access, and ecosystem partnerships.",
    note: "Helpful for ventures with an education or innovation ecosystem angle.",
  },
  {
    id: "scheme-4",
    name: "T-Hub Program Access",
    sector: "General",
    supportType: "Acceleration",
    amountBand: "Program-based",
    organization: "T-Hub",
    summary: "Acceleration pathways, mentors, ecosystem connections, and investor readiness support.",
    note: "Strong fit when the founder needs networks as much as capital.",
  },
  {
    id: "scheme-5",
    name: "NIDHI-PRAYAS",
    sector: "Health",
    supportType: "Prototype Grant",
    amountBand: "Up to 10L",
    organization: "DST",
    summary: "Supports prototype and proof-of-concept work before formal commercialization.",
    note: "A good match when the simulation shows strong demand but weak technical readiness.",
  },
  {
    id: "scheme-6",
    name: "Social Innovation Fund Pathways",
    sector: "Livelihoods",
    supportType: "Blended Support",
    amountBand: "Varies",
    organization: "State / Mission Programs",
    summary: "Useful for social ventures that combine measurable impact with local implementation partnerships.",
    note: "Treat this as a discovery starter and verify the latest regional options before applying.",
  },
];

export const GOVERNMENT_SCHEMES = [
  {
    id: "gov-scheme-1",
    name: "Startup India Seed Fund Scheme",
    description:
      "Provides early-stage financial support for proof of concept, prototype development, product trials, market entry, and commercialization through eligible incubators.",
    category: "Seed Funding",
    amount: "Up to Rs. 50 lakh",
    eligibility: "DPIIT-recognized startups under 2 years old with an innovative business idea",
    deadline: "Rolling applications",
    applyLink: "https://seedfund.startupindia.gov.in/",
    state: "National",
  },
  {
    id: "gov-scheme-2",
    name: "Stand-Up India",
    description:
      "Supports greenfield ventures with bank loans for women entrepreneurs and SC/ST founders in manufacturing, services, and trading sectors.",
    category: "Inclusive Finance",
    amount: "Rs. 10 lakh to Rs. 1 crore",
    eligibility: "Women entrepreneurs and SC/ST founders starting a first-time greenfield enterprise",
    deadline: "Rolling applications",
    applyLink: "https://www.standupmitra.in/",
    state: "National",
  },
  {
    id: "gov-scheme-3",
    name: "PMEGP",
    description:
      "Offers margin money subsidy support to help first-generation entrepreneurs launch micro-enterprises across rural and urban India.",
    category: "Micro Enterprise",
    amount: "Project support up to Rs. 50 lakh",
    eligibility: "New micro-enterprises promoted by individuals, SHGs, institutions, and trusts",
    deadline: "31 Dec 2026",
    applyLink: "https://www.kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp",
    state: "National",
  },
  {
    id: "gov-scheme-4",
    name: "NIDHI-PRAYAS",
    description:
      "Helps innovation-led founders move from idea to prototype by funding physical product development before commercialization.",
    category: "Prototype Grant",
    amount: "Up to Rs. 10 lakh",
    eligibility: "Innovators and early startups building proof-of-concept or prototype-stage products",
    deadline: "15 Nov 2026",
    applyLink: "https://nidhi-prayas.org/",
    state: "National",
  },
  {
    id: "gov-scheme-5",
    name: "Karnataka Elevate",
    description:
      "Supports startups through grant capital, mentoring, pilot opportunities, and startup ecosystem access for innovation-led ventures.",
    category: "Innovation Grant",
    amount: "Up to Rs. 50 lakh",
    eligibility: "Eligible startups registered in Karnataka with innovation-driven products or services",
    deadline: "20 Oct 2026",
    applyLink: "https://startup.karnataka.gov.in/",
    state: "Karnataka",
  },
  {
    id: "gov-scheme-6",
    name: "StartupTN TANSEED",
    description:
      "State startup seed support for scalable ventures that need validation capital, pilot support, and ecosystem backing in Tamil Nadu.",
    category: "Seed Funding",
    amount: "Up to Rs. 10 lakh",
    eligibility: "Tamil Nadu startups with scalable and innovation-oriented business models",
    deadline: "5 Sep 2026",
    applyLink: "https://startuptn.in/",
    state: "Tamil Nadu",
  },
];

export const dashboardFallback = {
  score: 82,
  demandScore: 76,
  investorInterest: 9,
  categoryScores: scenarioBlueprints.map((item) => ({
    category: item.category,
    weight: item.weight,
    value: Math.min(92, item.weight + 62),
  })),
  strengths: ["Market understanding", "Clear social impact framing"],
  weaknesses: ["Financial assumptions need detail", "Scale plan needs constraints"],
  recommendations: [
    "State the first revenue motion clearly and attach a realistic price point.",
    "Name the first 100 users and the channel that gets you in front of them.",
    "Show what evidence would prove the model is both viable and socially useful.",
  ],
};

export const messageThreads = [
  {
    id: "thread-1",
    name: "Maya Ventures",
    role: "Investor",
    status: "Active now",
    preview: "Send over the demand experiment details when ready.",
    messages: [
      { id: "m-1", sender: "them", text: "We reviewed your score movement from 72 to 84.", time: "09:10" },
      { id: "m-2", sender: "me", text: "I can share the district rollout assumptions next.", time: "09:14" },
      { id: "m-3", sender: "them", text: "Send over the demand experiment details when ready.", time: "09:18" },
    ],
  },
  {
    id: "thread-2",
    name: "Peer Founders Circle",
    role: "Community",
    status: "3 new replies",
    preview: "Your pricing assumptions sparked a good discussion.",
    messages: [
      { id: "m-4", sender: "them", text: "Your pricing assumptions sparked a good discussion.", time: "Yesterday" },
      { id: "m-5", sender: "me", text: "I’m revising it around repeat usage, not signups.", time: "Yesterday" },
    ],
  },
  {
    id: "thread-3",
    name: "Northfield Capital",
    role: "Investor",
    status: "Follow-up due",
    preview: "We want a cleaner unit economics snapshot.",
    messages: [
      { id: "m-6", sender: "them", text: "We want a cleaner unit economics snapshot.", time: "Mon" },
      { id: "m-7", sender: "me", text: "I’ll send a revised breakdown after this week’s pilot.", time: "Mon" },
    ],
  },
];

export const settingsDefaults = {
  darkSummaryEmails: true,
  investorAlerts: true,
  publicProfile: true,
  weeklyDigest: false,
};

