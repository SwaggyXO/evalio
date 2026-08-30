export type WorkItemStatus = 'To Do' | 'In Progress' | 'Done';
export type WorkItemType = 'Task' | 'Story' | 'Bug';

export interface Space {
  key: string;
  name: string;
}

export interface Page {
  id: string;
  spaceKey: string;
  title: string;
  body: string;
  updatedAt: string;
}

export interface WorkItem {
  key: string;
  spaceKey: string;
  title: string;
  description: string;
  status: WorkItemStatus;
  type: WorkItemType;
  assignee: string;
  updatedAt: string;
  acceptance: string[];
}

export interface SearchHit {
  pageId: string;
  title: string;
  score: number;
  reasons: MatchReason[];
  snippet: string;
}

export interface MatchReason {
  field: 'title' | 'body';
  terms: string[];
}
