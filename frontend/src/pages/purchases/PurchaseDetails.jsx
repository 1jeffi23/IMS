import {
  useGetPurchaseByIdQuery,
} from "../../services/purchaseApi";


const PurchaseDetails = ({
  purchaseId,
  onBack,
}) => {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetPurchaseByIdQuery(
    purchaseId,
    {
      skip: !purchaseId,
    }
  );


  const purchase =
    data?.purchase;


  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {

    return (
      <div className="p-6">

        <button
          onClick={onBack}
          className="border px-4 py-2 rounded-lg mb-6"
        >
          ← Back
        </button>

        <p className="text-gray-500">
          Loading purchase...
        </p>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {

    return (
      <div className="p-6">

        <button
          onClick={onBack}
          className="border px-4 py-2 rounded-lg mb-6"
        >
          ← Back
        </button>

        <p className="text-red-600">
          Failed to load purchase:{" "}
          {error?.data?.message ||
            "Something went wrong"}
        </p>

      </div>
    );

  }


  if (!purchase) {
    return null;
  }


  const items =
    purchase.items || [];


  return (

    <div className="p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-black mb-3"
          >
            ← Back to Purchases
          </button>

          <h1 className="text-2xl font-semibold">
            Purchase Details
          </h1>

          <p className="text-gray-500 mt-1">
            Invoice #{purchase.invoiceNumber}
          </p>

        </div>

      </div>


      {/* ======================================
          PURCHASE INFO
      ====================================== */}

      <div className="border rounded-xl bg-white p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <div>

            <p className="text-sm text-gray-500">
              Invoice Number
            </p>

            <p className="font-medium mt-1">
              {purchase.invoiceNumber}
            </p>

          </div>


          <div>

            <p className="text-sm text-gray-500">
              Supplier
            </p>

            <p className="font-medium mt-1">
              {purchase.supplierName || "-"}
            </p>

          </div>


          <div>

            <p className="text-sm text-gray-500">
              Purchase Date
            </p>

            <p className="font-medium mt-1">
              {purchase.purchaseDate}
            </p>

          </div>


          <div>

            <p className="text-sm text-gray-500">
              Total Amount
            </p>

            <p className="font-semibold text-lg mt-1">
              Rs.{" "}
              {Number(
                purchase.totalAmount || 0
              ).toLocaleString("en-PK")}
            </p>

          </div>

        </div>

      </div>


      {/* ======================================
          ITEMS
      ====================================== */}

      <div className="border rounded-xl bg-white overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="font-semibold">
            Purchased Items
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Products included in this purchase
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Product
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  SKU
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Batch
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Quantity
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Cost Price
                </th>

                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              {items.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-8 text-gray-500"
                  >
                    No items found
                  </td>

                </tr>

              ) : (

                items.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-4">

                      <p className="font-medium">
                        {item.productName || "-"}
                      </p>

                    </td>


                    <td className="p-4 text-gray-600">
                      {item.sku || "-"}
                    </td>


                    <td className="p-4">
                      {item.batchNumber || "-"}
                    </td>


                    <td className="p-4">
                      {item.quantity}
                    </td>


                    <td className="p-4">
                      Rs.{" "}
                      {Number(
                        item.costPrice || 0
                      ).toLocaleString("en-PK")}
                    </td>


                    <td className="p-4 font-medium">
                      Rs.{" "}
                      {Number(
                        item.totalPrice || 0
                      ).toLocaleString("en-PK")}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          TOTAL
      ====================================== */}

      <div className="flex justify-end mt-5">

        <div className="border rounded-xl p-5 w-full md:w-80">

          <div className="flex justify-between">

            <span className="text-gray-500">
              Grand Total
            </span>

            <span className="text-xl font-semibold">
              Rs.{" "}
              {Number(
                purchase.totalAmount || 0
              ).toLocaleString("en-PK")}
            </span>

          </div>

        </div>

      </div>

    </div>

  );
};


export default PurchaseDetails;