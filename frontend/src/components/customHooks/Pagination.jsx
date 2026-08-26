import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const Pagination = ({
  currentpage,
  totalPages,
  nextPage,
  prevPage,
  gotoPage,
}) => {

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];

  if (totalPages <= 5) {

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

  } else if (currentpage <= 3) {

    pageNumbers.push(
      1,
      2,
      3,
      4,
      "...",
      totalPages
    );

  } else if (currentpage >= totalPages - 2) {

    pageNumbers.push(
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );

  } else {

    pageNumbers.push(
      1,
      "...",
      currentpage - 1,
      currentpage,
      currentpage + 1,
      "...",
      totalPages
    );

  }


  return (
    <div className="
      flex
      flex-col
      gap-3
      sm:flex-row
      sm:items-center
      sm:justify-between
    ">

      <p className="text-xs text-muted-foreground">
        Page {currentpage} of {totalPages}
      </p>


      <div className="flex items-center justify-center gap-1">

        {/* PREVIOUS */}

        <Button
          variant="outline"
          size="icon"
          className="
            h-9
            w-9
            hover:border-emerald-400
            hover:text-emerald-600
            hover:bg-emerald-50
          "
          onClick={prevPage}
          disabled={currentpage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>


        {/* PAGE NUMBERS */}

        {pageNumbers.map((page, index) => {

          if (page === "...") {

            return (
              <span
                key={`dots-${index}`}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-sm
                  text-muted-foreground
                "
              >
                ...
              </span>
            );

          }


          return (
            <Button
              key={page}
              variant={
                currentpage === page
                  ? "default"
                  : "outline"
              }
              size="sm"
              className={
                currentpage === page
                  ? "h-9 min-w-9 bg-emerald-600 text-white hover:bg-emerald-700"
                  : "h-9 min-w-9 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
              }
              onClick={() => gotoPage(page)}
            >
              {page}
            </Button>
          );

        })}


        {/* NEXT */}

        <Button
          variant="outline"
          size="icon"
          className="
            h-9
            w-9
            hover:border-emerald-400
            hover:text-emerald-600
            hover:bg-emerald-50
          "
          onClick={nextPage}
          disabled={currentpage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

      </div>

    </div>
  );
};

export default Pagination;