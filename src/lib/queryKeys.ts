export const qk = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tenders: {
    list: (filters?: Record<string, any>) => ["tenders", "list", filters ?? {}] as const,
    detail: (id: string) => ["tenders", "detail", id] as const,
  },
  bids: {
    mine: ["bids", "mine"] as const,
    byTender: (tenderId: string) => ["bids", "byTender", tenderId] as const,
  },
  evaluations: {
    list: ["evaluations", "list"] as const,
  },
};
