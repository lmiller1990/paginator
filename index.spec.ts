import { paginate, IPageNode, TNode } from './paginate'
import { createContext } from 'istanbul-lib-report';

interface IListArgs {
  totalItems: number
}

interface IItem {
  id: number
}

const createList = ({ totalItems }: IListArgs): IItem[] => {
  const arr = []
  for (let i = 0; i < totalItems; i++) {
    arr.push({ id: i })
  }
  return arr
}

describe('less than 5 pages', () => {
  it('shows all pages', () => {
    const list = createList({ totalItems: 50 })
    const actual = paginate(list, { currentPage: 1 }, { perPage: 10 })
    const expected: TNode[] = [
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
      { type: 'pageNumber', value: 1, isCurrentPage: true },
      { type: 'pageNumber', value: 1, isCurrentPage: false },
      { type: 'pageNumber', value: 2, isCurrentPage: false },
      { type: 'pageNumber', value: 3, isCurrentPage: false },
      { type: 'pageNumber', value: 4, isCurrentPage: false },
      { type: 'pageNumber', value: 5, isCurrentPage: false },
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' }
    ]

    expect([ actual[0], actual[1] ]).toEqual([ 
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
    ])


    expect([ actual[7], actual[8] ]).toEqual([ 
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' },
    ])
  })
})

describe('exactly 7 pages', () => {
  it('shows all pages', () => {
    const list = createList({ totalItems: 70 })
    const actual = paginate(list, { currentPage: 1 }, { perPage: 10 })
    const expected: TNode[] = [
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
      { type: 'pageNumber', value: 1, isCurrentPage: false },
      { type: 'pageNumber', value: 1, isCurrentPage: false },
      { type: 'pageNumber', value: 2, isCurrentPage: false },
      { type: 'pageNumber', value: 3, isCurrentPage: false },
      { type: 'pageNumber', value: 4, isCurrentPage: false },
      { type: 'pageNumber', value: 5, isCurrentPage: false },
      { type: 'pageNumber', value: 6, isCurrentPage: false },
      { type: 'pageNumber', value: 7, isCurrentPage: false },
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' }
    ]

    expect([ actual[0], actual[1] ]).toEqual([ 
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
    ])

    expect(actual[5]).toEqual({ type: 'pageNumber', value: 4, isCurrentPage: false })


    expect([ actual[9], actual[10] ]).toEqual([ 
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' },
    ])
  })
})

describe('more than 7 pages', () => {
  it('shows dots to hide pages', () => {
    const list = createList({ totalItems: 1000 })
    const currentPage = 1
    const actual = paginate(list, { currentPage }, { perPage: 10 })

    // Case 3.1: [1, 2, 3, 4, 5, 6, 7, 8 ..... 1000] (1000 pages)
    // Current page is 1
    // << | < | 1 | 2 | 3 | ... | 98 | 99 | 100 | > | >>
    const expected: TNode[] = [
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
      { type: 'pageNumber', value: 1, isCurrentPage: true },
      { type: 'pageNumber', value: 2, isCurrentPage: false },
      { type: 'pageNumber', value: 3, isCurrentPage: false },
      { type: 'dots', value: '...' },
      { type: 'pageNumber', value: 98, isCurrentPage: false },
      { type: 'pageNumber', value: 99, isCurrentPage: false },
      { type: 'pageNumber', value: 100, isCurrentPage: false },
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' }
    ]

    expect([ actual[0], actual[1] ]).toEqual([ 
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
    ])

    expect([ actual[2], actual[3], actual[4] ]).toEqual([
      { type: 'pageNumber', value: 1, isCurrentPage: true },
      { type: 'pageNumber', value: 2, isCurrentPage: false },
      { type: 'pageNumber', value: 3, isCurrentPage: false },
    ])

    expect([ actual[5] ]).toEqual([
      { type: 'dots', value: '...' }
    ])

    expect([ actual[6], actual[7], actual[8] ]).toEqual([
      { type: 'pageNumber', value: 98, isCurrentPage: false },
      { type: 'pageNumber', value: 99, isCurrentPage: false },
      { type: 'pageNumber', value: 100, isCurrentPage: false },
    ])


    expect([ actual[9], actual[10] ]).toEqual([ 
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' },
    ])
  })

  it('current page is in the middle', () => {
    const list = createList({ totalItems: 1000 })
    const currentPage = 50
    const actual = paginate(list, { currentPage }, { perPage: 10 })

    // Case 3.2: [1, 2, 3, 4, 5, 6, 7, 8 ..... 100] (100 pages)
    // Current page is 500
    // << | < | 1 | ... | 49 | 50 | 51 | ... | 100 | > | >>

    expect([ actual[0], actual[1] ]).toEqual([ 
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
    ])

    expect(actual[2]).toEqual(
      { type: 'pageNumber', value: 1, isCurrentPage: false },
    )

    expect(actual[3]).toEqual(
      { type: 'dots', value: '...' },
    )

    expect([ actual[4], actual[5], actual[6] ]).toEqual([
      { type: 'pageNumber', value: 49, isCurrentPage: false },
      { type: 'pageNumber', value: 50, isCurrentPage: true },
      { type: 'pageNumber', value: 51, isCurrentPage: false },
    ])

    expect(actual[7]).toEqual(
      { type: 'dots', value: '...' },
    )

    expect(actual[8]).toEqual(
      { type: 'pageNumber', value: 100, isCurrentPage: false },
    )

    expect([ actual[9], actual[10] ]).toEqual([ 
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' },
    ])
  })

  it('current page is at the end', () => {
    const list = createList({ totalItems: 1000 })
    const currentPage = 97
    const actual = paginate(list, { currentPage }, { perPage: 10 })

    // Case 3.4: [1, 2, 3, 4, 5, 6, 7, 8 ..... 100] (100 pages)
    // Current page is 997
    // << | < | 1 | ... | 96 | 97 | 98 | 99 | 100 | > | >>

    expect([ actual[0], actual[1] ]).toEqual([ 
      { type: 'navigation', value: '<<' },
      { type: 'navigation', value: '<' },
    ])

    expect(actual[2]).toEqual(
      { type: 'pageNumber', value: 1, isCurrentPage: false },
    )

    expect(actual[3]).toEqual(
      { type: 'dots', value: '...' },
    )

    expect([ actual[4], actual[5], actual[6], actual[7], actual[8] ]).toEqual([
      { type: 'pageNumber', value: 96, isCurrentPage: false },
      { type: 'pageNumber', value: 97, isCurrentPage: true },
      { type: 'pageNumber', value: 98, isCurrentPage: false },
      { type: 'pageNumber', value: 99, isCurrentPage: false },
      { type: 'pageNumber', value: 100, isCurrentPage: false },
    ])

    expect([ actual[9], actual[10] ]).toEqual([ 
      { type: 'navigation', value: '>' },
      { type: 'navigation', value: '>>' },
    ])
  })
})
