import { useMemo, useState } from "react";

import {
  Mail,
  Plus,
  RefreshCcw,
  Search,
  Users,
  Phone,
} from "lucide-react";

import {
  useGetCustomersQuery,
} from "../../services/customerApi";

import CustomerForm from "./CustomerForm";
import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

import usePagination from "../../components/customHooks/usePagination";
import Pagination from "../../components/customHooks/Pagination";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


const CUSTOMERS_PER_PAGE = 5;


const Customers = () => {

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");


  // GET CUSTOMERS

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetCustomersQuery();


  const customers = data?.customers || [];


  // FILTER CUSTOMERS

  const filteredCustomers = useMemo(() => {

    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return customers;
    }

    return customers.filter((customer) => {

      return (
        customer.name
          ?.toLowerCase()
          .includes(searchText) ||

        customer.phone
          ?.toLowerCase()
          .includes(searchText) ||

        customer.email
          ?.toLowerCase()
          .includes(searchText)
      );

    });

  }, [customers, search]);


  // SUMMARY

  const {
    totalCustomers,
    customersWithPhone,
    customersWithEmail,
  } = useMemo(() => {

    let withPhone = 0;
    let withEmail = 0;

    customers.forEach((customer) => {

      if (customer.phone) {
        withPhone++;
      }

      if (customer.email) {
        withEmail++;
      }

    });

    return {
      totalCustomers: customers.length,
      customersWithPhone: withPhone,
      customersWithEmail: withEmail,
    };

  }, [customers]);


  // PAGINATION

  const {
    currentpage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    gotoPage,
  } = usePagination(
    filteredCustomers,
    CUSTOMERS_PER_PAGE
  );


  // SEARCH

  const handleSearch = (value) => {

    setSearch(value);
    gotoPage(1);

  };


  // LOADING

  if (isLoading) {
    return <Loader text="Loading Customers..." />;
  }


  // ERROR

  if (isError) {

    return (
      <ErrorState
        title="Failed to load customers"
        message={
          error?.data?.message ||
          "Something went wrong while fetching customers."
        }
      />
    );

  }


  return (

    <div className="space-y-6 p-4 md:p-6">


      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

              <Users className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Customers
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage your customer information
              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          {/* REFRESH */}

          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={isFetching}
            title="Refresh"
          >

            <RefreshCcw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

          </Button>


          {/* ADD CUSTOMER */}

          <Button
            onClick={() => setShowForm(true)}
            className="gap-2"
          >

            <Plus className="h-4 w-4" />

            <span>
              Add Customer
            </span>

          </Button>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


        {/* TOTAL */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  Total Customers
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {totalCustomers.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  All registered customers
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <Users className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* PHONE */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  With Phone
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                  {customersWithPhone.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customers with phone number
                </p>

              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">

                <Phone className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>


        {/* EMAIL */}

        <Card className="border-0 shadow-sm">

          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-muted-foreground">
                  With Email
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600">
                  {customersWithEmail.toLocaleString("en-PK")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customers with email
                </p>

              </div>

              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">

                <Mail className="h-5 w-5" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* SEARCH */}

      <Card className="border-0 shadow-sm">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                placeholder="Search by name, phone or email..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  pl-9
                  pr-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/20
                "
              />

            </div>


            {search && (

              <Button
                variant="outline"
                onClick={() => handleSearch("")}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>

            )}

          </div>


          {/* RESULT COUNT */}

          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-muted-foreground">

              Showing{" "}

              <span className="font-medium text-foreground">

                {filteredCustomers.length === 0
                  ? 0
                  : (currentpage - 1) *
                      CUSTOMERS_PER_PAGE +
                    1}

              </span>

              {" "}–{" "}

              <span className="font-medium text-foreground">

                {Math.min(
                  currentpage * CUSTOMERS_PER_PAGE,
                  filteredCustomers.length
                )}

              </span>

              {" "}of{" "}

              <span className="font-medium text-foreground">
                {filteredCustomers.length}
              </span>

              {" "}customers

            </p>


            {search && (

              <p className="text-xs text-muted-foreground">
                Search results
              </p>

            )}

          </div>

        </CardContent>

      </Card>


      {/* CUSTOMER TABLE */}

      <Card className="overflow-hidden border-0 shadow-sm">

        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead className="border-b bg-muted/40">

                <tr>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Phone
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Created
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    ID
                  </th>

                </tr>

              </thead>


              <tbody>

                {currentData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">

                        <Users className="h-5 w-5 text-muted-foreground" />

                      </div>

                      <p className="mt-3 font-medium text-foreground">
                        No customers found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">

                        {search
                          ? "Try changing your search."
                          : "Add your first customer to get started."}

                      </p>


                      {!search && (

                        <Button
                          variant="link"
                          onClick={() => setShowForm(true)}
                          className="mt-2"
                        >
                          Add Customer
                        </Button>

                      )}

                    </td>

                  </tr>

                ) : (

                  currentData.map((customer) => (

                    <tr
                      key={customer.id}
                      className="
                        border-b
                        last:border-b-0
                        transition
                        hover:bg-muted/30
                      "
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-100
                            text-sm
                            font-semibold
                            text-emerald-700
                          ">

                            {customer.name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-foreground">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Customer #{customer.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-5 py-4">

                        {customer.phone ? (

                          <span className="text-sm text-foreground">
                            {customer.phone}
                          </span>

                        ) : (

                          <span className="text-sm text-muted-foreground">
                            Not provided
                          </span>

                        )}

                      </td>


                      <td className="max-w-[260px] px-5 py-4">

                        {customer.email ? (

                          <span className="block truncate text-sm text-foreground">
                            {customer.email}
                          </span>

                        ) : (

                          <span className="text-sm text-muted-foreground">
                            Not provided
                          </span>

                        )}

                      </td>


                      <td className="px-5 py-4">

                        {customer.createdAt ? (

                          <div>

                            <p className="text-sm text-foreground">

                              {new Date(
                                customer.createdAt
                              ).toLocaleDateString(
                                "en-PK",
                                {
                                  dateStyle: "medium",
                                }
                              )}

                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">

                              {new Date(
                                customer.createdAt
                              ).toLocaleTimeString(
                                "en-PK",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}

                            </p>

                          </div>

                        ) : (

                          <span className="text-sm text-muted-foreground">
                            -
                          </span>

                        )}

                      </td>


                      <td className="px-5 py-4 text-right">

                        <span className="
                          inline-flex
                          rounded-md
                          bg-muted
                          px-2.5
                          py-1
                          font-mono
                          text-xs
                          text-muted-foreground
                        ">
                          #{customer.id}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>


      {/* PAGINATION */}

      <Pagination
        currentpage={currentpage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        gotoPage={gotoPage}
      />


      {/* CUSTOMER FORM */}

      {showForm && (

        <CustomerForm
          onClose={() => setShowForm(false)}
        />

      )}

    </div>

  );

};


export default Customers;