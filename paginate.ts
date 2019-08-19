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

const arr = []
for (let i = 0; i < 10000; i++) {
  arr.push({ id: i })
}

type TNodeType = 'dots' | 'pageNumber' | 'navigation'

export type TNode = IPageNumberNode | IDotsNode | INavigationNode

export interface IPageNode {
  type: TNodeType
}

export interface IPageNumberNode extends IPageNode {
  type: 'pageNumber'
  value: number
}

export interface IDotsNode extends IPageNode {
  type: 'dots'
  value: '...'
}

export interface INavigationNode extends IPageNode {
  type: 'navigation'
  value: '<' | '<<' | '>' | '>>'
}    

const gotoStart: INavigationNode = { type: 'navigation', value: '<<' }
const previous: INavigationNode = { type: 'navigation', value: '<' }

const gotoEnd: INavigationNode = { type: 'navigation', value: '>>' }
const next: INavigationNode = { type: 'navigation', value: '>' }

interface IPaginateOptions {
  perPage: number
}

interface IPaginationState {
  currentPage: number
}

const paginate = (list: any[], { currentPage }: IPaginationState, { perPage }: IPaginateOptions) => {
  const pageCount = Math.ceil(list.length / perPage)

  const nodes: TNode[] = [gotoStart, previous]

  if (pageCount <= 7) {
    for (let i = 0; i < pageCount; i++) {
      nodes.push({
        type: 'pageNumber',
        value: i + 1
      })
    }

    return [...nodes, next, gotoEnd]
  }

  // first 3
  nodes.push({ type: 'pageNumber', value: 1 })
  nodes.push({ type: 'pageNumber', value: 2 })
  nodes.push({ type: 'pageNumber', value: 3 })

  nodes.push({ type: 'dots', value: '...' })

  const nFromEnd = (count: number, n: number): number => {
    return count - n
  }

  nodes.push({ type: 'pageNumber', value: pageCount - 2 })
  nodes.push({ type: 'pageNumber', value: pageCount - 1 })
  nodes.push({ type: 'pageNumber', value: pageCount })

  return [...nodes, next, gotoEnd]
}

export {
  paginate
}