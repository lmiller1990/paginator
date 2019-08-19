import { paginate } from "./paginate";

interface IListArgs {
  totalItems: number;
}

const createList = ({ totalItems }: IListArgs): number[] => {
  const arr = [];
  for (let i = 0; i < totalItems; i++) {
    arr.push(i);
  }
  return arr;
};

const list = createList({ totalItems: 1000 });

console.log(paginate(list, { currentPage: 45 }, { perPage: 10 }));
