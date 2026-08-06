import type { LucideIcon } from "lucide-react";
import { FileText, Landmark, Scale, ScrollText } from "lucide-react";

export type TaskId = "judgment" | "statute" | "summary" | "precedent";

export type LegalTask = {
  id: TaskId;
  emoji: string;
  icon: LucideIcon;
  name: string;
  blurb: string;
  /** tailwind gradient classes */
  gradient: string;
  ring: string;
};

export const TASKS: LegalTask[] = [
  {
    id: "judgment",
    emoji: "⚖️",
    icon: Scale,
    name: "Judgment Prediction",
    blurb: "Forecast probable outcome with reasoning and confidence bands.",
    gradient: "from-[oklch(0.62_0.19_256)] to-[oklch(0.52_0.16_246)]",
    ring: "oklch(0.62 0.19 256)",
  },
  {
    id: "statute",
    emoji: "📜",
    icon: ScrollText,
    name: "Statute Extraction",
    blurb: "Pull every cited act, section and provision from the filing.",
    gradient: "from-[oklch(0.63_0.21_293)] to-[oklch(0.52_0.19_288)]",
    ring: "oklch(0.63 0.21 293)",
  },
  {
    id: "summary",
    emoji: "📝",
    icon: FileText,
    name: "Legal Summarization",
    blurb: "Condense long records into issue-wise, citable briefs.",
    gradient: "from-[oklch(0.72_0.17_158)] to-[oklch(0.58_0.14_168)]",
    ring: "oklch(0.72 0.17 158)",
  },
  {
    id: "precedent",
    emoji: "🏛️",
    icon: Landmark,
    name: "Prior Cases",
    blurb: "Retrieve semantically similar precedents ranked by relevance.",
    gradient: "from-[oklch(0.81_0.15_80)] to-[oklch(0.68_0.15_60)]",
    ring: "oklch(0.81 0.15 80)",
  },
];

export type LegalModel = {
  id: string;
  name: string;
  vendor: string;
  mark: string;
  description: string;
  speed: 1 | 2 | 3 | 4 | 5;
  quality: string;
  latency: string;
};

export const MODELS: LegalModel[] = [
  {
    id: "kimi",
    name: "Kimi",
    vendor: "Moonshot",
    mark: "K",
    description: "Long-context specialist for 500-page records.",
    speed: 3,
    quality: "Flagship",
    latency: "~4.2s",
  },
  {
    id: "qwen",
    name: "Qwen",
    vendor: "Alibaba",
    mark: "Q",
    description: "Balanced reasoning with strong multilingual statutes.",
    speed: 4,
    quality: "Balanced",
    latency: "~2.8s",
  },
  {
    id: "llama",
    name: "Llama",
    vendor: "Meta",
    mark: "L",
    description: "Fastest drafts, ideal for iterative research loops.",
    speed: 5,
    quality: "Fast",
    latency: "~1.4s",
  },
  {
    id: "gpt-oss",
    name: "GPT OSS",
    vendor: "Open weights",
    mark: "G",
    description: "Deep chain-of-thought for judgment prediction.",
    speed: 2,
    quality: "Precise",
    latency: "~6.0s",
  },
];

export type HistoryItem = {
  id: string;
  task: TaskId;
  title: string;
  date: string;
  model: string;
};

export const HISTORY: HistoryItem[] = [
  { id: "h1", task: "judgment", title: "Mehta v. State of Maharashtra", date: "Aug 6", model: "Kimi" },
  { id: "h2", task: "precedent", title: "Arbitration clause severability", date: "Aug 5", model: "Qwen" },
  { id: "h3", task: "summary", title: "SEBI show-cause reply bundle", date: "Aug 5", model: "Llama" },
  { id: "h4", task: "statute", title: "IBC §7 admission threshold", date: "Aug 4", model: "GPT OSS" },
  { id: "h5", task: "judgment", title: "Kohli Estate partition appeal", date: "Aug 3", model: "Kimi" },
  { id: "h6", task: "summary", title: "Non-compete enforceability memo", date: "Aug 2", model: "Qwen" },
  { id: "h7", task: "precedent", title: "Anticipatory bail — economic offence", date: "Aug 1", model: "Llama" },
  { id: "h8", task: "statute", title: "GST ITC reversal provisions", date: "Jul 30", model: "Qwen" },
  { id: "h9", task: "summary", title: "Shareholder oppression petition", date: "Jul 29", model: "Kimi" },
  { id: "h10", task: "judgment", title: "Trademark passing-off injunction", date: "Jul 28", model: "GPT OSS" },
];

export type PriorCase = {
  id: string;
  court: string;
  number: string;
  title: string;
  year: number;
  similarity: number;
  sections: string[];
  judges: string[];
  state: string;
  preview: string;
};

export const PRIOR_CASES: PriorCase[] = [
  {
    id: "c1",
    court: "Supreme Court of India",
    number: "Civil Appeal No. 4412 of 2021",
    title: "Vidya Drolia v. Durga Trading Corporation",
    year: 2021,
    similarity: 96,
    sections: ["Arbitration Act §8", "Arbitration Act §11", "Contract Act §28"],
    judges: ["N.V. Ramana", "Sanjiv Khanna", "Krishna Murari"],
    state: "Delhi",
    preview:
      "Held that questions of non-arbitrability may be examined at the reference stage only where the claim is manifestly and ex-facie non-arbitrable.",
  },
  {
    id: "c2",
    court: "Bombay High Court",
    number: "Comm. Arb. Pet. 318 of 2019",
    title: "Sanghvi Movers v. Reliance Infrastructure",
    year: 2019,
    similarity: 91,
    sections: ["Arbitration Act §9", "Specific Relief Act §14"],
    judges: ["A.K. Menon"],
    state: "Maharashtra",
    preview:
      "Interim protection granted where the balance of convenience favoured preserving the subject matter pending constitution of the tribunal.",
  },
  {
    id: "c3",
    court: "Delhi High Court",
    number: "O.M.P. (COMM) 145 of 2020",
    title: "NHAI v. Trichy Thanjavur Expressway",
    year: 2020,
    similarity: 88,
    sections: ["Arbitration Act §34", "Arbitration Act §37"],
    judges: ["Vibhu Bakhru", "Amit Mahajan"],
    state: "Delhi",
    preview:
      "Clarified the narrow scope of interference with arbitral awards, confining review to patent illegality on the face of the record.",
  },
  {
    id: "c4",
    court: "Karnataka High Court",
    number: "W.P. No. 22107 of 2018",
    title: "Infotech Solutions v. State of Karnataka",
    year: 2018,
    similarity: 84,
    sections: ["Constitution Art. 226", "Contract Act §23"],
    judges: ["B.V. Nagarathna"],
    state: "Karnataka",
    preview:
      "Writ jurisdiction declined where an efficacious contractual remedy existed and no element of public law unfairness was demonstrated.",
  },
  {
    id: "c5",
    court: "Supreme Court of India",
    number: "Civil Appeal No. 9307 of 2019",
    title: "Hindustan Construction v. Union of India",
    year: 2019,
    similarity: 81,
    sections: ["IBC §7", "Arbitration Act §36"],
    judges: ["R.F. Nariman", "Surya Kant", "V. Ramasubramanian"],
    state: "Delhi",
    preview:
      "Automatic stay on enforcement of awards struck down as manifestly arbitrary, restoring the deposit-based discretionary regime.",
  },
  {
    id: "c6",
    court: "Madras High Court",
    number: "A.No. 5312 of 2017",
    title: "Ramco Cements v. TANGEDCO",
    year: 2017,
    similarity: 77,
    sections: ["Electricity Act §86", "Arbitration Act §16"],
    judges: ["Sanjib Banerjee", "Senthilkumar Ramamoorthy"],
    state: "Tamil Nadu",
    preview:
      "Statutory regulator held to have exclusive jurisdiction, displacing the arbitration agreement to the extent of tariff disputes.",
  },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Judgment prediction complete",
    body: "Mehta v. State of Maharashtra — 82% confidence.",
    time: "2m ago",
    tone: "success" as const,
  },
  {
    id: "n2",
    title: "6 precedents matched",
    body: "New Supreme Court ruling matches your saved query.",
    time: "1h ago",
    tone: "info" as const,
  },
  {
    id: "n3",
    title: "Storage 68% used",
    body: "13.6 GB of 20 GB consumed on the Firm plan.",
    time: "Yesterday",
    tone: "warning" as const,
  },
];