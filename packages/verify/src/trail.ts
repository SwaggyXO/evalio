import type { TrailNode, TrailStage } from '@evalio/domain';

export function buildTrail(input: {
  pageTitle: string;
  pageId: string;
  excerpt: string;
  citedPageId: string;
}): TrailNode[] {
  return [
    {
      stage: 'retrieve',
      label: `Retrieved ${input.pageTitle}`,
      pageId: input.pageId,
    },
    {
      stage: 'extract',
      label: input.excerpt.slice(0, 80),
      pageId: input.pageId,
    },
    {
      stage: 'assemble',
      label: `Cited ${input.citedPageId}`,
      pageId: input.citedPageId,
    },
  ];
}

export function brokenStageFor(status: string): TrailStage | undefined {
  if (status === 'unsupported') return 'extract';
  if (status === 'wrong_source') return 'assemble';
  return undefined;
}
