import { useState } from "react";

const Pagination = ({data, isLoading}) => {
    console.log(data)
  if (isLoading) {
    return;
  }
  console.log(data)
  const [pageNumber, setPageNumber] = useState(0);
  const dataPerPage = 10;
  const pagesVisites = pageNumber * dataPerPage;
  const pageCount = Math.ceil(data.length / dataPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return [pageCount, changePage, pagesVisites, dataPerPage];
};

export default Pagination;
