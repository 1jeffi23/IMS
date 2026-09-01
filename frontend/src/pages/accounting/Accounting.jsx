import { useMemo, useState } from "react";
import {
  CalendarDays,
  RefreshCcw,
  Wallet,
} from "lucide-react";

import { useGetAccountingSummaryQuery } from "../../services/accountingApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import AccountingOverview from "./AccountingOverview";
import ErrorState from "../loader/ErrorState";

const Accounting = () => {
  const [dateFilter, setDateFilter] = useState("month");

  const dateRange = useMemo(() => {
    const today = new Date();

    const formatDate = (date) =>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
     

    if (dateFilter === "today") {
      const date = formatDate(today);

      return {
        startDate: date,
        endDate: date,
      };
    }

    if (dateFilter === "week") {
      const start = new Date(today);
      const day = start.getDay();

      start.setDate(
        start.getDate() - (day === 0 ? 6 : day - 1)
      );

      return {
        startDate: formatDate(start),
        endDate: formatDate(today),
      };
    }

    if (dateFilter === "month") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        startDate: formatDate(start),
        endDate: formatDate(today),
      };
    }

    // All Time
    return {};
  }, [dateFilter]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAccountingSummaryQuery(dateRange);

  const accounting = data?.data || {};

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">

            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Accounting
              </h1>

              <p className="text-sm text-muted-foreground">
                Monitor your business financial performance
              </p>
            </div>

          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={refetch}
          disabled={isLoading}
          title="Refresh"
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </Button>

      </div>

      {/* Date Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-medium">
              Financial Period
            </span>
          </div>

          <div className="flex flex-wrap gap-2">

            <Button
              size="sm"
              variant={
                dateFilter === "today"
                  ? "default"
                  : "outline"
              }
              onClick={() => setDateFilter("today")}
            >
              Today
            </Button>

            <Button
              size="sm"
              variant={
                dateFilter === "week"
                  ? "default"
                  : "outline"
              }
              onClick={() => setDateFilter("week")}
            >
              This Week
            </Button>

            <Button
              size="sm"
              variant={
                dateFilter === "month"
                  ? "default"
                  : "outline"
              }
              onClick={() => setDateFilter("month")}
            >
              This Month
            </Button>

            <Button
              size="sm"
              variant={
                dateFilter === "all"
                  ? "default"
                  : "outline"
              }
              onClick={() => setDateFilter("all")}
            >
              All Time
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <ErrorState
               title="Failed to load Accounting"
               message={
                 
                 "Failed to load Accounting data."
               }
             />
      )}

      {!isError && ( 
        <AccountingOverview
         accounting={accounting || {}}
          isLoading={isLoading} /> 
          )}

    </div>
  );
};

export default Accounting;