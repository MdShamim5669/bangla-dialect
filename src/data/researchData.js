export const RESEARCH_BENCHMARKS = {
  title: "Preserving Dialects, Enhancing Communication: A Model For Translating Regional Bangladeshi Languages into Standard Bengali",
  overall: [
    { model: "BanglaT5 (Final Model)", bleu: "50.87", chrf: "75.34", bertF1: "0.9392", sts: "0.9195", winner: true },
    { model: "mT5-base", bleu: "47.60", chrf: "72.75", bertF1: "0.9324", sts: "0.9100", winner: false },
    { model: "mT5-small", bleu: "43.58", chrf: "70.06", bertF1: "0.9241", sts: "0.8884", winner: false },
  ],
  perRegion: [
    { region: "Jashore", testN: 250, bleu: "69.31", chrf: "86.98", bertF1: "0.9696", sts: "0.9627", exactMatch: "41.20%", identityRate: "34.84%" },
    { region: "Rangpur", testN: 250, bleu: "54.14", chrf: "79.40", bertF1: "0.9475", sts: "0.9326", exactMatch: "26.40%", identityRate: "2.24%" },
    { region: "Pabna", testN: 250, bleu: "50.63", chrf: "74.52", bertF1: "0.9349", sts: "0.9076", exactMatch: "24.40%", identityRate: "0.92%" },
    { region: "Noakhali", testN: 250, bleu: "47.49", chrf: "73.60", bertF1: "0.9357", sts: "0.9260", exactMatch: "20.80%", identityRate: "0.64%" },
    { region: "Barishal", testN: 153, bleu: "44.17", chrf: "71.36", bertF1: "0.9314", sts: "0.9246", exactMatch: "17.65%", identityRate: "1.00%" },
    { region: "Mymensingh", testN: 153, bleu: "41.73", chrf: "69.15", bertF1: "0.9273", sts: "0.9146", exactMatch: "18.30%", identityRate: "1.07%" },
    { region: "Chittagong", testN: 113, bleu: "31.63", chrf: "60.65", bertF1: "0.8976", sts: "0.8685", exactMatch: "13.27%", identityRate: "0.44%" },
  ],
  edaFindings: [
    {
      title: "Jashore vs. Chittagong: Lexical Overlap Explains High Scores",
      content: "34.84% of Jashore sentences are lexically identical to Standard Bengali in the dataset, which substantially elevates its scores. Conversely, Chittagong has only 0.44% identical sentences and represents genuine, high-complexity translation with Jaccard overlap of only 0.07-0.14."
    },
    {
      title: "Monolingual Pretraining Superiority",
      content: "BanglaT5 (`csebuetnlp/banglat5`) consistently outperformed both multilingual models (mT5-base and mT5-small) across every metric on all 7 regions, proving the advantage of dedicated Bengali pretraining."
    },
    {
      title: "Two-Stage Leakage-Free Split",
      content: "An initial row-level split caused memorization due to multiple dialects sharing standard targets. Re-implementing with ID-grouping and target text deduplication established true generalization."
    }
  ]
};
