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

export interface IPaginateOptions {
  perPage: number;
}

export interface IPaginationState {
  currentPage: number;
}