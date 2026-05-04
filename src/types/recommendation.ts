export interface Recommendation {
  id: string;
  curiosityId: string;
  body: string;
  authorName?: string;
  createdAt: Date;
}

export interface RecommendationDraft {
  curiosityId: string;
  body: string;
  authorName?: string;
}
