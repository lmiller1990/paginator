// Spec:
// Tile count should be static
// There should always be 11 tiles showing at max, including next, previous, last and first buttons

// Case 1: Pages are [1,2,3,4,5] (5 or less pages)
// Current page is 1
// Show all pages, and navigation buttons regardless of current page
// << | < | 1 | 2 | 3 | 4 | 5 | > | >>

// Case 2.1: Pages are [1, 2, 3, 4, 5, 6, 7]
// Current page is 1
// << | < | 1 | 2 | 3 | ... | 5 |  6 | 7 | > | >>

// Case 2.2: Pages are [1, 2, 3, 4, 5, 6, 7]
// Current page is 4
// << | < | 1 | 2 | 3 | 4 | 5 | 6 | 7 | > | >>

// Case 2.3: [1, 2, 3, 4, 5, 6, 7]
// Current page is 7
// << | < | 1 | 2 | 3 | 4 | 5 | 6 | 7 | > | >>

// Case 3.1: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
// Current page is 1
// << | < | 1 | 2 | 3 | ... | 998 | 999 | 1000 | > | >>

// Case 3.2: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
// Current page is 500
// << | < | 1 | ... | 499 | 500 | 501 | ... | 1000 | > | >>

// Case 3.3: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
// Current page is 996
// << | < | 1 | ... | 995 | 996 | 997 | ... | 1000 | > | >>

// Case 3.4: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
// Current page is 997
// << | < | 1 | ... | 996 | 997 | 998 | 999 | 1000 | > | >>

// Case 3.5: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
// Current page is 1000
// << | < | 1 | 2 | 3 | ... | 998 | 999 | 1000 | > | >>

const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.push({ id: i });
}

type TNodeType = "dots" | "pageNumber" | "navigation";

export type TNode = IPageNumberNode | IDotsNode | INavigationNode;

export interface IPageNode {
  type: TNodeType;
}

export interface IPageNumberNode extends IPageNode {
  type: "pageNumber";
  isCurrentPage: boolean;
  value: number;
}

export interface IDotsNode extends IPageNode {
  type: "dots";
  value: "...";
}

export interface INavigationNode extends IPageNode {
  type: "navigation";
  value: "<" | "<<" | ">" | ">>";
}

const gotoStart: INavigationNode = { type: "navigation", value: "<<" };
const previous: INavigationNode = { type: "navigation", value: "<" };

const gotoEnd: INavigationNode = { type: "navigation", value: ">>" };
const next: INavigationNode = { type: "navigation", value: ">" };

interface IPaginateOptions {
  perPage: number;
}

interface IPaginationState {
  currentPage: number;
}

const paginate = (
  list: any[],
  { currentPage }: IPaginationState,
  { perPage }: IPaginateOptions
) => {
  const makePageNumberNode = (value: number): IPageNumberNode => {
    return {
      type: "pageNumber",
      value,
      isCurrentPage: value === currentPage
    };
  };

  const pageCount = Math.ceil(list.length / perPage);

  const nodes: TNode[] = [gotoStart, previous];

  // The total pages are less than 7 so no need to show '...'.
  // Just render all pages.
  if (pageCount <= 7) {
    for (let i = 0; i < pageCount; i++) {
      nodes.push(makePageNumberNode(i + 1));
    }
    return [...nodes, next, gotoEnd];
  }

  // current page is near the start
  if (currentPage < 3) {
    nodes.push(makePageNumberNode(1));
    nodes.push(makePageNumberNode(2));
    nodes.push(makePageNumberNode(3));
    nodes.push({ type: "dots", value: "..." });
    nodes.push(makePageNumberNode(pageCount - 2));
    nodes.push(makePageNumberNode(pageCount - 1));
    nodes.push(makePageNumberNode(pageCount));
    return [...nodes, next, gotoEnd];
  }

  // current page is near the end
  if (currentPage > pageCount - 5) {
    nodes.push(makePageNumberNode(1));
    nodes.push({ type: "dots", value: "..." });
    nodes.push(makePageNumberNode(pageCount - 4));
    nodes.push(makePageNumberNode(pageCount - 3));
    nodes.push(makePageNumberNode(pageCount - 2));
    nodes.push(makePageNumberNode(pageCount - 1));
    nodes.push(makePageNumberNode(pageCount));
    return [...nodes, next, gotoEnd];
  }

  // current page is "in the middle", eg not near the start or end!!
  nodes.push(makePageNumberNode(1));
  nodes.push({ type: "dots", value: "..." });
  nodes.push(makePageNumberNode(currentPage - 1));
  nodes.push(makePageNumberNode(currentPage));
  nodes.push(makePageNumberNode(currentPage + 1));
  nodes.push({ type: "dots", value: "..." });
  nodes.push(makePageNumberNode(pageCount));
  return [...nodes, next, gotoEnd];
};

export { paginate };
