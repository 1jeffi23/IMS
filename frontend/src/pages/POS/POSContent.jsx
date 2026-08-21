const POSContent = ({
  search,
  setSearch,

  productsLoading,
  filteredProducts,
  handleAddProduct,

  cart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeItem,

  customers,
  customersLoading,
  customerId,
  setCustomerId,

  showCustomerForm,
  setShowCustomerForm,
  CustomerForm,
  handleCustomerCreated,

  subtotal,

  discount,
  setDiscount,

  tax,
  setTax,

  total,

  paymentMethod,
  setPaymentMethod,

  amountPaid,
  setAmountPaid,

  handleCompleteSale,
  isCreatingSale,
}) => {
  return (
    <div className="p-6">

      {/* 
          HEADER*/}

      <div className="mb-6">

        <h1 className="text-2xl font-semibold">
          Point of Sale
        </h1>

        <p className="mt-1 text-gray-500">
          Create a new sale and manage checkout
        </p>

      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <div className="space-y-6 lg:col-span-2">

          {/* PRODUCT SEARCH */}

          <div className="rounded-xl border bg-white p-5">

            <label className="mb-2 block text-sm font-medium">
              Search Product
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search product name or SKU..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
            />

            {/* SEARCH RESULTS */}

            {search &&
              filteredProducts.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-lg border">

                  {filteredProducts.map(
                    (product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleAddProduct(
                            product
                          )
                        }
                        className="w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                      >

                        <div className="flex justify-between">

                          <div>

                            <p className="font-medium">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-medium">
                              Rs.{" "}
                              {Number(
                                product.sellingPrice
                              ).toLocaleString(
                                "en-PK"
                              )}
                            </p>

                            <p className="text-xs text-gray-500">
                              Stock:{" "}
                              {product.quantity}
                            </p>

                          </div>

                        </div>

                      </button>
                    )
                  )}

                </div>
              )}

            {search &&
              !productsLoading &&
              filteredProducts.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  No products found
                </p>
              )}

          </div>


          {/* CART */}

          <div className="rounded-xl border bg-white">

            <div className="flex justify-between border-b p-5">

              <h2 className="font-semibold">
                Cart
              </h2>

              <span className="text-sm text-gray-500">
                {cart.length} item
                {cart.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {cart.length === 0 ? (

              <div className="p-10 text-center">

                <p className="text-gray-500">
                  Cart is empty
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Search and select a product
                  to add it here
                </p>

              </div>

            ) : (

              <div>

                {cart.map((item) => (

                  <div
                    key={item.productId}
                    className="border-b p-5 last:border-b-0"
                  >

                    <div className="flex justify-between gap-4">

                      <div className="flex-1">

                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Rs.{" "}
                          {item.unitPrice.toLocaleString(
                            "en-PK"
                          )}{" "}
                          / {item.unit}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-semibold">
                          Rs.{" "}
                          {item.totalPrice.toLocaleString(
                            "en-PK"
                          )}
                        </p>

                      </div>

                    </div>


                    <div className="mt-4 flex items-center justify-between">

                      {/* QUANTITY */}

                      <div className="flex items-center overflow-hidden rounded-lg border">

                        {/* DECREASE */}
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.productId)}
                          className="px-3 py-1.5 hover:bg-gray-100"
                        >
                          −
                        </button>

                        {/* MANUAL QUANTITY */}
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = Number(e.target.value);

                            if (value >= 1) {
                              updateQuantity(item.productId, value);
                            }
                          }}
                          className="w-16 border-x px-2 py-1.5 text-center outline-none focus:bg-blue-50"
                        />

                        {/* INCREASE */}
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.productId)}
                          className="px-3 py-1.5 hover:bg-gray-100"
                        >
                          +
                        </button>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.productId
                          )
                        }
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <div className="space-y-6">

          {/* CUSTOMER */}

          <div className="rounded-xl border bg-white p-5">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="font-semibold">
                Customer
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCustomerForm(true)
                }
                className="text-sm font-medium hover:underline"
              >
                + Add Customer
              </button>

            </div>


            <select
              value={customerId}
              onChange={(e) =>
                setCustomerId(
                  e.target.value
                )
              }
              disabled={customersLoading}
              className="w-full rounded-lg border px-3 py-2.5"
            >

              <option value="">
                Walk-in Customer
              </option>

              {customers.map(
                (customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}

                    {customer.phone
                      ? ` - ${customer.phone}`
                      : ""}
                  </option>
                )
              )}

            </select>

          </div>


          {/* CUSTOMER FORM MODAL */}

          {showCustomerForm && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-lg font-semibold">
                    Add Customer
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCustomerForm(false)
                    }
                    className="text-xl text-gray-500 hover:text-black"
                  >
                    ×
                  </button>

                </div>


                <CustomerForm
                  onSuccess={
                    handleCustomerCreated
                  }
                  onCancel={() =>
                    setShowCustomerForm(false)
                  }
                />

              </div>

            </div>

          )}


          {/* PAYMENT */}

          <div className="rounded-xl border bg-white p-5">

            <h2 className="mb-5 font-semibold">
              Payment
            </h2>

            <div className="space-y-4">

              {/* SUBTOTAL */}

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  Rs.{" "}
                  {subtotal.toLocaleString(
                    "en-PK"
                  )}
                </span>

              </div>


              {/* DISCOUNT */}

              <div>

                <label className="mb-1 block text-sm text-gray-500">
                  Discount
                </label>

                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>


              {/* TAX */}

              <div>

                <label className="mb-1 block text-sm text-gray-500">
                  Tax
                </label>

                <input
                  type="number"
                  min="0"
                  value={tax}
                  onChange={(e) =>
                    setTax(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>


              {/* TOTAL */}

              <div className="border-t pt-4">

                <div className="flex justify-between">

                  <span className="font-medium">
                    Total
                  </span>

                  <span className="text-xl font-semibold">
                    Rs.{" "}
                    {total.toLocaleString(
                      "en-PK"
                    )}
                  </span>

                </div>

              </div>


              {/* PAYMENT METHOD */}

              <div>

                <label className="mb-1 block text-sm text-gray-500">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >

                  <option value="cash">
                    Cash
                  </option>

                  <option value="card">
                    Card
                  </option>

                </select>

              </div>


              {/* AMOUNT PAID */}

              <div>

                <label className="mb-1 block text-sm text-gray-500">
                  Amount Paid
                </label>

                <input
                  type="number"
                  min="0"
                  value={amountPaid}
                  onChange={(e) =>
                    setAmountPaid(
                      e.target.value
                    )
                  }
                  placeholder={String(total)}
                  className="w-full rounded-lg border px-3 py-2"
                />

              </div>


              {/* COMPLETE SALE */}

              <button
                type="button"
                onClick={
                  handleCompleteSale
                }
                disabled={
                  isCreatingSale ||
                  cart.length === 0
                }
                className="w-full rounded-lg bg-black py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingSale
                  ? "Processing..."
                  : `Complete Sale — Rs. ${total.toLocaleString(
                    "en-PK"
                  )}`}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default POSContent;