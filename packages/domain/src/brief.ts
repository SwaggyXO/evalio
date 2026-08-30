export type ClaimStatus =
  | 'executable'
  | 'needs_human'
  | 'wrong_source'
  | 'unsupported'
  | 'conflict'
  | 'stale';

export type TrailStage = 'retrieve' | 'extract' | 'assemble';

export interface TrailNode {
  stage: TrailStage;
  label: string;
  pageId?: string;
}

export interface Claim {
  id: string;
  text: string;
  citedPageId: string;
  supportingPageId?: string;
  status: ClaimStatus;
  trail: TrailNode[];
  brokenStage?: TrailStage;
  checksUsed: number;
}

export interface RubricItem {
  text: string;
  covered: boolean;
}

export interface Conflict {
  topic: string;
  pageIds: [string, string];
  left: string;
  right: string;
}

export interface StaleFlag {
  pageId: string;
  pageUpdatedAt: string;
  comparedTo: string;
}

export type Readiness = 'agent_ready' | 'needs_human';

export interface Brief {
  workItemKey: string;
  title: string;
  claims: Claim[];
  rubric: RubricItem[];
  conflicts: Conflict[];
  stale: StaleFlag[];
  readiness: Readiness;
  notReadyReasons: string[];
}
