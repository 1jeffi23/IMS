import { useMemo, useState } from "react";

import {
  useGetProductsQuery,
} from "../../services/productApi";

import {
  useGetCustomersQuery,
} from "../../services/customerApi";

import {
  useCreateSaleMutation,
} from "../../services/saleApi";

import CustomerForm from "./CustomerForm";


const POS = () => {

  // ==========================================
  // STATE
  // ==========================================

  const [search, setSearch] =
    useState("");

  const [cart, setCart] =
    useState([]);

  const [customerId, setCustomerId] =
    useState("");

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [discount, setDiscount] =
    useState(0);

  const [tax, setTax] =
    useState(0);

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const [amountPaid, setAmountPaid] =
    useState("");


  // ==========================================
  // API
  // ==========================================

  const {
    data: productData,
    isLoading: productsLoading,
  } = useGetProductsQuery();


  const {
    data: customerData,
    isLoading: customersLoading,
  } = useGetCustomersQuery();


  const [
    createSale,
    {
      isLoading: isCreatingSale,
    },
  ] = useCreateSaleMutation();


  const products =
    productData?.products || [];


  const customers =
    customerData?.customers || [];


  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const filteredProducts =
    useMemo(() => {

      const text =
        search
          .toLowerCase()
          .trim();


      if (!text) {
        return [];
      }


      return products
        .filter(
          (product) =>
            product.isActive &&
            (
              product.name
                ?.toLowerCase()
                .includes(text) ||

              product.sku
                ?.toLowerCase()
                .includes(text)
            )
        )
        .slice(0, 8);

    }, [
      products,
      search,
    ]);


  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  const handleAddProduct = (
    product
  ) => {

    const existing =
      cart.find(
        (item) =>
          item.productId ===
          product.id
      );


    if (existing) {

      if (
        existing.quantity >=
        Number(product.quantity)
      ) {

        alert(
          `Only ${product.quantity} units available`
        );

        return;
      }


      setCart(
        cart.map(
          (item) =>
            item.productId ===
            product.id
              ? {
                  ...item,

                  quantity:
                    item.quantity + 1,

                  totalPrice:
                    (item.quantity + 1) *
                    Number(
                      item.unitPrice
                    ),
                }
              : item
        )
      );

    } else {

      setCart([

        ...cart,

        {

          productId:
            product.id,

          name:
            product.name,

          sku:
            product.sku,

          unit:
            product.unit || "piece",

          unitPrice:
            Number(
              product.sellingPrice
            ),

          quantity: 1,

          totalPrice:
            Number(
              product.sellingPrice
            ),

          availableStock:
            Number(
              product.quantity
            ),

        },

      ]);

    }


    setSearch("");

  };


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (
    productId
  ) => {

    setCart(

      cart.map(
        (item) => {

          if (
            item.productId !==
            productId
          ) {
            return item;
          }


          if (
            item.quantity >=
            item.availableStock
          ) {

            alert(
              `Only ${item.availableStock} units available`
            );

            return item;
          }


          const quantity =
            item.quantity + 1;


          return {

            ...item,

            quantity,

            totalPrice:
              quantity *
              item.unitPrice,

          };

        }
      )

    );

  };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (
    productId
  ) => {

    setCart(

      cart
        .map(
          (item) => {

            if (
              item.productId !==
              productId
            ) {
              return item;
            }


            const quantity =
              item.quantity - 1;


            return {

              ...item,

              quantity,

              totalPrice:
                quantity *
                item.unitPrice,

            };

          }
        )
        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };


  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (
    productId
  ) => {

    setCart(
      cart.filter(
        (item) =>
          item.productId !==
          productId
      )
    );

  };


  // ==========================================
  // TOTALS
  // ==========================================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.totalPrice,
      0
    );


  const discountAmount =
    Number(discount) || 0;


  const taxAmount =
    Number(tax) || 0;


  const total =
    Math.max(
      0,
      subtotal -
        discountAmount +
        taxAmount
    );


  // ==========================================
  // COMPLETE SALE
  // ==========================================

  const handleCompleteSale =
    async () => {

      if (cart.length === 0) {

        alert(
          "Please add at least one product"
        );

        return;
      }


      const paid =
        Number(amountPaid);


      if (
        Number.isNaN(paid) ||
        paid < total
      ) {

        alert(
          "Amount paid is insufficient"
        );

        return;
      }


      try {

        const result =
          await createSale({

            customerId:
              customerId
                ? Number(customerId)
                : null,

            items:
              cart.map(
                (item) => ({

                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                })
              ),

            discount:
              discountAmount,

            tax:
              taxAmount,

            paymentMethod,

            amountPaid:
              paid,

          }).unwrap();


        alert(
          `Sale completed successfully! Sale #${result.sale.id}`
        );


        // ======================================
        // CLEAR POS
        // ======================================

        setCart([]);

        setCustomerId("");

        setDiscount(0);

        setTax(0);

        setAmountPaid("");


      } catch (error) {

        console.error(
          "Create sale error:",
          error
        );


        alert(
          error?.data?.message ||
          "Failed to complete sale"
        );

      }

    };


  // ==========================================
  // CUSTOMER CREATED SUCCESSFULLY
  // ==========================================

  const handleCustomerCreated = (
    createdCustomer
  ) => {

    const customer =
      createdCustomer?.customer ||
      createdCustomer;


    if (customer?.id) {

      setCustomerId(
        String(customer.id)
      );

    }


    setShowCustomerForm(false);

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="p-6">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-6">

        <h1 className="text-2xl font-semibold">
          Point of Sale
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new sale and manage checkout
        </p>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <div className="lg:col-span-2 space-y-6">


          {/* ===================================
              PRODUCT SEARCH
          ==================================== */}

          <div className="border rounded-xl bg-white p-5">

            <label className="block text-sm font-medium mb-2">
              Search Product
            </label>


            <input

              type="text"

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              placeholder="Search product name or SKU..."

              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"

            />


            {/* SEARCH RESULTS */}

            {search &&
              filteredProducts.length > 0 && (

                <div className="border rounded-lg mt-2 overflow-hidden">

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

                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"

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

                <p className="text-sm text-gray-500 mt-3">
                  No products found
                </p>

              )}

          </div>


          {/* ===================================
              CART
          ==================================== */}

          <div className="border rounded-xl bg-white">

            <div className="p-5 border-b flex justify-between">

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

                <p className="text-sm text-gray-400 mt-1">
                  Search and select a product
                  to add it here
                </p>

              </div>

            ) : (

              <div>

                {cart.map(
                  (item) => (

                    <div
                      key={item.productId}
                      className="p-5 border-b last:border-b-0"
                    >

                      <div className="flex justify-between gap-4">

                        <div className="flex-1">

                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
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


                      <div className="flex items-center justify-between mt-4">


                        {/* QUANTITY */}

                        <div className="flex items-center border rounded-lg overflow-hidden">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.productId
                              )
                            }
                            className="px-3 py-1.5 hover:bg-gray-100"
                          >
                            −
                          </button>


                          <span className="px-4 py-1.5 border-x">
                            {item.quantity}
                          </span>


                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.productId
                              )
                            }
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

                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <div className="space-y-6">


          {/* ===================================
              CUSTOMER
          ==================================== */}

          <div className="border rounded-xl bg-white p-5">

            <div className="flex items-center justify-between mb-4">

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

              className="w-full border rounded-lg px-3 py-2.5"

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


          {/* ===================================
              CUSTOMER FORM MODAL
          ==================================== */}

          {showCustomerForm && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-lg font-semibold">
                    Add Customer
                  </h2>


                  <button

                    type="button"

                    onClick={() =>
                      setShowCustomerForm(false)
                    }

                    className="text-gray-500 hover:text-black text-xl"

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


          {/* ===================================
              PAYMENT
          ==================================== */}

          <div className="border rounded-xl bg-white p-5">

            <h2 className="font-semibold mb-5">
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

                <label className="block text-sm text-gray-500 mb-1">
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

                  className="w-full border rounded-lg px-3 py-2"

                />

              </div>


              {/* TAX */}

              <div>

                <label className="block text-sm text-gray-500 mb-1">
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

                  className="w-full border rounded-lg px-3 py-2"

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

                <label className="block text-sm text-gray-500 mb-1">
                  Payment Method
                </label>

                <select

                  value={paymentMethod}

                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }

                  className="w-full border rounded-lg px-3 py-2"

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

                <label className="block text-sm text-gray-500 mb-1">
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

                  className="w-full border rounded-lg px-3 py-2"

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

                className="w-full bg-black text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"

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


export default POS;