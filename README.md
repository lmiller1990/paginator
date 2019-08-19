## Paginator

A simple function and data structure to represent a paginated list, written in TypeScript.

For lists with less than 7 pages, it will generate this structure:

```
<< | < | 1 | 2 | 3 | 4 | 5 | > | >>
```

For lists with great than 7 pages, there will always be 11 elements, representing:

- `<<` gotoFirst page
- `>>` gotoLast page
- `<` go to next page
- `>` go to previous page

Examples for a list with 1000 items:

```
// paginate(list, { currentPage: 1 }, { perPage: 10 })
<< | < | 1 | 2 | 3 | ... | 98 | 99 | 100 | > | >>

// paginate(list, { currentPage: 50 }, { perPage: 10 })
<< | < | 1 | ... | 49 | 50 | 51 | ... | 100 | > | >>

// paginate(list, { currentPage: 97 }, { perPage: 10 })
<< | < | 1 | ... | 96 | 97 | 98 | 99 | 100 | > | >>
```

## Usage

Styling and rendering is up to the user. This library just generates the correct pagination structure for your list.

```ts
// an array of whatever you want to paginate
const list = [{ id: 1 }, { id: 2 }, ........... { id: 1000 }] 

paginate(list, { currentPage: 45 }, { perPage: 10 })

// returns the following:
[ 
  { type: "navigation", symbol: "<<", action: "gotoFirst" },
  { type: "navigation", symbol: "<", action: "previous" }
  { type: 'pageNumber', value: 1, isCurrentPage: false },
  { type: 'dots', value: '...' },
  { type: 'pageNumber', value: 44, isCurrentPage: false },
  { type: 'pageNumber', value: 45, isCurrentPage: true },
  { type: 'pageNumber', value: 46, isCurrentPage: false },
  { type: 'dots', value: '...' },
  { type: 'pageNumber', value: 100, isCurrentPage: false },
  { type: "navigation", symbol: ">", action: "next" },
  { type: "navigation", symbol: ">>", action: "gotoLast" }
]
```

Using the above structure, render you page controls however you want. For example using JSX:

```jsx
render() {
  const pageNodes = paginate(myList, { currentPage: 1 }, { perPage: 10 })
  
  return (
    pageNodes.map(node => {
      if (node.type === 'navigation') {
        return (
          <div onClick={() => handleNavigation(node.action)}>
            {node.symbol}
          </div>
        )
      }

      if (node.type === 'pageNumber') {
        return (
          <div 
            onClick={() => handleGotoPage(node.value)}
            style={{ fontWeight: node.isCurrentPage ? 'bold' : 'regular' }}
          >
            {node.value}
          </div>
        )
      }  

      // dots do nothing
      return (
        <div>
          {node.value}
        </div>
      )
    })
  )
}
```

## Demo

Todo!