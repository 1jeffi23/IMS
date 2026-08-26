import { useState } from "react";

import axios from "axios";

import {
  Download,
  RefreshCw,
} from "lucide-react";


const PurchaseTable = ({
  purchases,
  refetch,
  isFetching,
}) => {

  const [downloadingPurchaseId, setDownloadingPurchaseId] =
    useState(null);


  // DOWNLOAD PURCHASE PDF

  const handleDownloadPDF = async (
    purchaseId
  ) => {

    try {

      setDownloadingPurchaseId(
        purchaseId
      );


      const response =
        await axios.get(
          `https://ims-backend-psi.vercel.app/api/purchases/${purchaseId}/invoice`,
          {
            responseType: "blob",
             withCredentials: true,
            
          }
        );


      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        `Purchase-Invoice-${purchaseId}.pdf`;


      document.body.appendChild(link);

      link.click();

      link.remove();


      window.URL.revokeObjectURL(
        url
      );


    } catch (error) {

      console.error(
        "Purchase invoice download error:",
        error
      );


      alert(
        error?.response?.data?.message ||
        "Failed to download purchase invoice"
      );


    } finally {

      setDownloadingPurchaseId(
        null
      );

    }

  };


  return (

    <div className="border rounded-xl overflow-hidden bg-white">

      <div className="overflow-x-auto">

        <table className="w-full min-w-225">


          {/* TABLE HEADER */}

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Invoice
              </th>

              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Supplier
              </th>

              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Purchase Date
              </th>

              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Total Amount
              </th>

              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Created
              </th>

              <th className="text-right p-4 text-sm font-medium text-gray-600">
                Invoice
              </th>

            </tr>

          </thead>


          {/* TABLE BODY */}

          <tbody>


            {purchases.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-10"
                >

                  <p className="text-gray-500">
                    No purchases found
                  </p>

                </td>

              </tr>

            ) : (

              purchases.map(
                (purchase) => {

                  const isDownloading =
                    downloadingPurchaseId ===
                    purchase.id;


                  return (

                    <tr
                      key={purchase.id}
                      className="border-t hover:bg-gray-50 transition"
                    >


                      {/* INVOICE */}

                      <td className="p-4">

                        <p className="font-medium">
                          {purchase.invoiceNumber}
                        </p>

                        <p className="text-xs text-gray-400">
                          Purchase #{purchase.id}
                        </p>

                      </td>


                      {/* SUPPLIER */}

                      <td className="p-4">

                        <p className="font-medium">
                          {purchase.supplierName || "-"}
                        </p>

                      </td>


                      {/* DATE */}

                      <td className="p-4 text-gray-600">

                        {purchase.purchaseDate || "-"}

                      </td>


                      {/* TOTAL */}

                      <td className="p-4">

                        <span className="font-medium">

                          Rs.{" "}

                          {Number(
                            purchase.totalAmount || 0
                          ).toLocaleString("en-PK")}

                        </span>

                      </td>


                      {/* CREATED */}

                      <td className="p-4 text-gray-500">

                        {purchase.createdAt
                          ? new Date(
                              purchase.createdAt
                            ).toLocaleDateString(
                              "en-PK"
                            )
                          : "-"}

                      </td>


                      {/* DOWNLOAD */}

                      <td className="p-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadPDF(
                              purchase.id
                            )
                          }
                          disabled={
                            downloadingPurchaseId !==
                            null
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >

                          {isDownloading ? (

                            <>

                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />

                              Generating...

                            </>

                          ) : (

                            <>

                              <Download
                                size={15}
                              />

                              PDF

                            </>

                          )}

                        </button>

                      </td>


                    </tr>

                  );

                }
              )

            )}


          </tbody>


        </table>

      </div>


    </div>

  );

};


export default PurchaseTable;