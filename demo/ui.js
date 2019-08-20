const PER_PAGE = 10

const createList = ({ totalItems }) => {
  const arr = [];
  for (let i = 0; i < totalItems; i++) {
    arr.push({ id: i+1, label: `This is item #${i+1}` });
  }
  return arr;
};

const pageControl = ({ value, callback }) => {
  return `
    <div onclick="${callback}" class="page-control">
      ${value}
    </div>
  `
}

const list = createList({ totalItems: 1000 })
const pages = paginator.paginate(list, { currentPage: 1 }, { perPage: PER_PAGE })

// indexesToRender is an array of numbers of elements to render
// eg [5,6,7,8,9,10]
const renderList = (list, { firstIndexOnPage, lastIndexOnPage }) => {
  const listEl = document.querySelector('#list')
  let html = ''
  for (const item of list.slice(firstIndexOnPage, lastIndexOnPage)) {
    html += `<div>${item.label}</div>`
  }
  listEl.innerHTML = html
}

let html = (innerHtml) => `<div class="d-flex">${innerHtml}</div>`
let innerHtml = ''

for (const page of pages) {
  if (page.type === 'navigation') {
    if (page.action === 'next') {
      const firstIndexOnPage =  PER_PAGE * (page.value - 1)
      const lastIndexOnPage =  PER_PAGE * (page.value)

      innerHtml += pageControl({ 
        value: page.symbol,
        callback: `renderList(list, {
          firstIndexOnPage: ${firstIndexOnPage},
          lastIndexOnPage: ${lastIndexOnPage}
        })`
      })
      continue
    }

    innerHtml += pageControl({ 
      value: page.symbol,
      callback: `renderList(list, {
        firstIndexOnPage: ${firstIndexOnPage},
        lastIndexOnPage: ${lastIndexOnPage}
      })`
    })
    continue
  }

  if (page.type === 'pageNumber') { 
    const firstIndexOnPage =  PER_PAGE * (page.value - 1)
    const lastIndexOnPage =  PER_PAGE * (page.value)

    innerHtml += pageControl({
      value: page.value, callback: `renderList(list, {
        firstIndexOnPage: ${firstIndexOnPage},
        lastIndexOnPage: ${lastIndexOnPage}
      })`
    })
    continue
  }

  innerHtml += pageControl({ value: page.value })
}

document.addEventListener("DOMContentLoaded", () => {
  const appEl = document.querySelector('#pagination')
  const listEl = document.querySelector('#list')

  appEl.innerHTML += html(innerHtml)
  renderList(list, {
    firstIndexOnPage: PER_PAGE * 0,
    lastIndexOnPage: PER_PAGE * 1
  })
})

