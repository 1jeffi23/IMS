import { useState } from "react";

import {
  useGetCustomersQuery,
} from "../../services/customerApi";

import CustomerForm from "./CustomerForm";
import Loader from "../loader/Loader";
import ErrorState from "../loader/ErrorState";

const Customers = () => {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCustomersQuery();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const customers =
    data?.customers || [];


  //====
  // SEARCH
  //====

  const filteredCustomers =
    customers.filter((customer) => {

      const searchText =
        search
          .toLowerCase()
          .trim();

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


  //====
  // SUMMARY
  //====

  const totalCustomers =
    customers.length;


  //====
  // LOADING
  //====

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
    <div className="p-6 bg-gray-50 min-h-full">

      <div className="max-w-8xl mx-auto">


        {/*
            HEADER
        */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <h1 className="text-2xl font-semibold text-gray-900">
              Customers
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your customer information
            </p>

          </div>


          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            + Add Customer
          </button>

        </div>


        {/*
            SUMMARY
       */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">


          {/* TOTAL */}

          <div className="bg-white border rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Customers
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {totalCustomers}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  All registered customers
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                👥
              </div>

            </div>

          </div>


          {/* WITH PHONE */}

          <div className="bg-white border rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  With Phone
                </p>

                <p className="text-2xl font-semibold text-green-600 mt-2">
                  {
                    customers.filter(
                      (customer) =>
                        customer.phone
                    ).length
                  }
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Customers with phone number
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
                📞
              </div>

            </div>

          </div>


          {/* WITH EMAIL */}

          <div className="bg-white border rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  With Email
                </p>

                <p className="text-2xl font-semibold text-purple-600 mt-2">
                  {
                    customers.filter(
                      (customer) =>
                        customer.email
                    ).length
                  }
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Customers with email
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                ✉
              </div>

            </div>

          </div>

        </div>


        {/*
            SEARCH
       */}

        <div className="bg-white border rounded-xl p-4 mb-5">

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, phone or email..."
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />

            </div>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}

          </div>


          <div className="mt-3 flex justify-between items-center">

            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredCustomers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {customers.length}
              </span>{" "}
              customers
            </p>

          </div>

        </div>


        {/*
            TABLE
        */}

        <div className="bg-white border rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-187.5">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                    Created
                  </th>

                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                    ID
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredCustomers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-14"
                    >

                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        👤
                      </div>

                      <p className="text-gray-600 font-medium mt-3">
                        No customers found
                      </p>

                      <p className="text-gray-400 text-sm mt-1">
                        {search
                          ? "Try changing your search."
                          : "Add your first customer to get started."}
                      </p>

                      {!search && (
                        <button
                          onClick={() =>
                            setShowForm(true)
                          }
                          className="mt-4 text-sm font-medium text-gray-900 underline"
                        >
                          Add Customer
                        </button>
                      )}

                    </td>

                  </tr>

                ) : (

                  filteredCustomers.map(
                    (customer) => (

                      <tr
                        key={customer.id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">

                              {customer.name
                                ?.charAt(0)
                                ?.toUpperCase()}

                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {customer.name}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Customer #{customer.id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PHONE */}

                        <td className="px-5 py-4">

                          {customer.phone ? (

                            <span className="text-sm text-gray-700">
                              {customer.phone}
                            </span>

                          ) : (

                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>

                          )}

                        </td>


                        {/* EMAIL */}

                        <td className="px-5 py-4">

                          {customer.email ? (

                            <span className="text-sm text-gray-700">
                              {customer.email}
                            </span>

                          ) : (

                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>

                          )}

                        </td>


                        {/* CREATED */}

                        <td className="px-5 py-4">

                          {customer.createdAt ? (

                            <div>

                              <p className="text-sm text-gray-700">
                                {new Date(
                                  customer.createdAt
                                ).toLocaleDateString(
                                  "en-PK",
                                  {
                                    dateStyle: "medium",
                                  }
                                )}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
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

                            <span className="text-gray-400">
                              -
                            </span>

                          )}

                        </td>


                        {/* ID */}

                        <td className="px-5 py-4 text-right">

                          <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-mono">
                            #{customer.id}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/*
          CUSTOMER FORM
      */}

      {showForm && (
        <CustomerForm
          onClose={() =>
            setShowForm(false)
          }
        />
      )}

    </div>
  );
};

export default Customers;