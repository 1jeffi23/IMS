import { useEffect, useState } from "react";

const usePagination = (data = [], itemsPerPage = 5) => {

  const [currentpage, setCurrentpage] = useState(1);

  const totalItems = data?.length || 0;

  const perPage = Number(itemsPerPage) || 5;

  const totalPages =
    totalItems > 0
      ? Math.ceil(totalItems / perPage)
      : 1;

  // Agar filtering ki wajah se current page exist na kare
  useEffect(() => {
    if (currentpage > totalPages) {
      setCurrentpage(totalPages);
    }
  }, [currentpage, totalPages]);


  const startIndex =
    (currentpage - 1) * perPage;

  const currentData =
    data?.slice(
      startIndex,
      startIndex + perPage
    ) || [];


  const nextPage = () => {
    setCurrentpage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };


  const prevPage = () => {
    setCurrentpage((prev) =>
      Math.max(prev - 1, 1)
    );
  };


  const gotoPage = (page) => {

    const newPage = Number(page);

    if (Number.isNaN(newPage)) {
      return;
    }

    setCurrentpage(
      Math.max(
        1,
        Math.min(newPage, totalPages)
      )
    );
  };


  return {
    currentpage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    gotoPage,
  };
};

export default usePagination;