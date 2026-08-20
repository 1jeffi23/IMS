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
import POSContent from "./POSContent";

const POS = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");

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

  const filteredProducts = useMemo(() => {
    const text = search
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
  }, [products, search]);

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const handleAddProduct = (product) => {
    const existing = cart.find(
      (item) =>
        item.productId === product.id
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
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
                totalPrice:
                  (item.quantity + 1) *
                  Number(item.unitPrice),
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unit:
            product.unit || "piece",
          unitPrice:
            Number(product.sellingPrice),
          quantity: 1,
          totalPrice:
            Number(product.sellingPrice),
          availableStock:
            Number(product.quantity),
        },
      ]);
    }

    setSearch("");
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) => {
        if (
          item.productId !== productId
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
            quantity * item.unitPrice,
        };
      })
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (productId) => {
    setCart(
      cart
        .map((item) => {
          if (
            item.productId !== productId
          ) {
            return item;
          }

          const quantity =
            item.quantity - 1;

          return {
            ...item,
            quantity,
            totalPrice:
              quantity * item.unitPrice,
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (productId) => {
    setCart(
      cart.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.totalPrice,
    0
  );

  const discountAmount =
    Number(discount) || 0;

  const taxAmount =
    Number(tax) || 0;

  const total = Math.max(
    0,
    subtotal -
      discountAmount +
      taxAmount
  );

  // ==========================================
  // COMPLETE SALE
  // ==========================================

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert(
        "Please add at least one product"
      );
      return;
    }

    const paid = Number(amountPaid);

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
          customerId: customerId
            ? Number(customerId)
            : null,

          items: cart.map((item) => ({
            productId:
              item.productId,
            quantity:
              item.quantity,
          })),

          discount: discountAmount,
          tax: taxAmount,
          paymentMethod,
          amountPaid: paid,
        }).unwrap();

      alert(
        `Sale completed successfully! Sale #${result.sale.id}`
      );

      // CLEAR POS

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
  // CUSTOMER CREATED
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
    <POSContent
      search={search}
      setSearch={setSearch}

      productsLoading={
        productsLoading
      }

      filteredProducts={
        filteredProducts
      }

      handleAddProduct={
        handleAddProduct
      }

      cart={cart}
      increaseQuantity={
        increaseQuantity
      }
      decreaseQuantity={
        decreaseQuantity
      }
      removeItem={removeItem}

      customers={customers}
      customersLoading={
        customersLoading
      }

      customerId={customerId}
      setCustomerId={setCustomerId}

      showCustomerForm={
        showCustomerForm
      }
      setShowCustomerForm={
        setShowCustomerForm
      }

      CustomerForm={CustomerForm}
      handleCustomerCreated={
        handleCustomerCreated
      }

      subtotal={subtotal}

      discount={discount}
      setDiscount={setDiscount}

      tax={tax}
      setTax={setTax}

      total={total}

      paymentMethod={paymentMethod}
      setPaymentMethod={
        setPaymentMethod
      }

      amountPaid={amountPaid}
      setAmountPaid={setAmountPaid}

      handleCompleteSale={
        handleCompleteSale
      }

      isCreatingSale={
        isCreatingSale
      }
    />
  );
};

export default POS;