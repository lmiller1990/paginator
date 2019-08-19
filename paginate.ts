import {
  INavigationNode,
  IPageNumberNode,
  IPaginateOptions,
  IPaginationState,
  TNode
} from "./types";

const gotoStart: INavigationNode = {
  type: "navigation",
  symbol: "<<",
  action: "gotoFirst"
};
const previous: INavigationNode = {
  type: "navigation",
  symbol: "<",
  action: "previous"
};

const gotoEnd: INavigationNode = {
  type: "navigation",
  symbol: ">>",
  action: "gotoLast"
};
const next: INavigationNode = {
  type: "navigation",
  symbol: ">",
  action: "next"
};

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

  // The total pages are less than 7 so no need to show '...'.
  // Just render all pages.
  if (pageCount <= 7) {
    const nodes: TNode[] = [gotoStart, previous];
    for (let i = 0; i < pageCount; i++) {
      nodes.push(makePageNumberNode(i + 1));
    }
    return [...nodes, next, gotoEnd];
  }

  // current page is near the start
  if (currentPage < 3) {
    const nodes: TNode[] = [gotoStart, previous];
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
    const nodes: TNode[] = [gotoStart, previous];
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
  const nodes: TNode[] = [gotoStart, previous];
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
