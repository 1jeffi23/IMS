import { useState } from "react";

import {
  useCreatePurchaseMutation,
} from "../../services/purchaseApi";

import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../services/productApi";

import {
  useGetSuppliersQuery,
} from "../../services/supplierApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";


const emptyItem = {
  productId: "",
  batchNumber: "",
  quantity: "",
  costPrice: "",
  receivedDate: "",
  expiryDate: "",
  storageLocation: "",
};


const emptyNewProduct = {
  name: "",
  sku: "",
  categoryId: "",
  unit: "piece",
  sellingPrice: "",
};


const PurchaseForm = ({ onClose }) => {


  // PURCHASE DATA


  const [formData, setFormData] = useState({
    supplierId: "",
    invoiceNumber: "",
    purchaseDate: "",
  });


  const [items, setItems] = useState([
    { ...emptyItem },
  ]);



  // NEW PRODUCT DATA


  const [newProductIndex, setNewProductIndex] =
    useState(null);


  const [newProduct, setNewProduct] =
    useState({
      ...emptyNewProduct,
    });



  // QUERIES


  const {
    data: productData,
    isLoading: productsLoading,
  } = useGetProductsQuery();

  const {
    data: categoryData,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const categories = categoryData?.categories || [];



  const {
    data: supplierData,
    isLoading: suppliersLoading,
  } = useGetSuppliersQuery();


  const products =
    productData?.products || [];


  const suppliers =
    supplierData?.suppliers || [];



  // MUTATIONS


  const [
    createPurchase,
    {
      isLoading: isCreatingPurchase,
    },
  ] = useCreatePurchaseMutation();


  const [
    createProduct,
    {
      isLoading: isCreatingProduct,
    },
  ] = useCreateProductMutation();



  // PURCHASE CHANGE


  const handlePurchaseChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };




  // ITEM CHANGE


  const handleItemChange = (
    index,
    field,
    value
  ) => {

    setItems((prev) => {

      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;

    });

  };



  // PRODUCT SELECT


  const handleProductSelect = (
    index,
    value
  ) => {

    if (value === "new") {

      setNewProductIndex(index);

      setNewProduct({
        ...emptyNewProduct,
      });

      handleItemChange(
        index,
        "productId",
        ""
      );

      return;
    }


    setNewProductIndex(null);

    handleItemChange(
      index,
      "productId",
      value
    );

  };



  // NEW PRODUCT CHANGE


  const handleNewProductChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

  };



  // ADD ITEM


  const addItem = () => {

    setItems((prev) => [
      ...prev,
      { ...emptyItem },
    ]);

  };



  // REMOVE ITEM


  const removeItem = (index) => {

    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );


    if (newProductIndex === index) {
      setNewProductIndex(null);
    }

  };



  // GET PRODUCT


  const getProduct = (productId) => {

    return products.find(
      (product) =>
        Number(product.id) ===
        Number(productId)
    );

  };



  // ITEM TOTAL


  const getItemTotal = (item) => {

    return (
      Number(item.quantity || 0) *
      Number(item.costPrice || 0)
    );

  };



  // GRAND TOTAL


  const grandTotal =
    items.reduce(
      (total, item) =>
        total + getItemTotal(item),
      0
    );



  // SUBMIT


  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      if (!formData.supplierId) {
        alert("Please select supplier");
        return;
      }


      if (!formData.invoiceNumber.trim()) {
        alert("Invoice number is required");
        return;
      }


      if (!formData.purchaseDate) {
        alert("Purchase date is required");
        return;
      }


      const finalItems = [];


      for (
        let index = 0;
        index < items.length;
        index++
      ) {

        const item = items[index];


        //
        // NEW PRODUCT
        //

        if (
          newProductIndex === index
        ) {

          if (!newProduct.name.trim()) {
            alert("Product name is required");
            return;
          }


          if (!newProduct.sku.trim()) {
            alert("Product SKU is required");
            return;
          }


          if (!newProduct.categoryId) {
            alert("Category is required");
            return;
          }


          if (!newProduct.sellingPrice) {
            alert("Selling price is required");
            return;
          }


          const createdProduct =
            await createProduct({
              name: newProduct.name.trim(),
              sku: newProduct.sku.trim(),
              categoryId:
                Number(newProduct.categoryId),
              unit: newProduct.unit,
              sellingPrice:
                Number(newProduct.sellingPrice),
            }).unwrap();


          const product =
            createdProduct.product ||
            createdProduct;


          if (!product?.id) {
            throw new Error(
              "Product was created but product ID was not returned"
            );
          }


          finalItems.push({

            productId:
              Number(product.id),

            batchNumber:
              item.batchNumber.trim(),

            quantity:
              Number(item.quantity),

            costPrice:
              Number(item.costPrice),

            receivedDate:
              item.receivedDate ||
              formData.purchaseDate,

            expiryDate:
              item.expiryDate ||
              null,

            storageLocation:
              item.storageLocation.trim() ||
              null,

          });


          continue;

        }


        //
        // EXISTING PRODUCT
        //

        if (!item.productId) {
          alert(
            `Please select product for item ${index + 1}`
          );
          return;
        }


        if (!item.batchNumber.trim()) {
          alert(
            `Batch number is required for item ${index + 1}`
          );
          return;
        }


        if (
          !item.quantity ||
          Number(item.quantity) <= 0
        ) {
          alert(
            `Quantity must be greater than 0 for item ${index + 1}`
          );
          return;
        }


        if (
          item.costPrice === "" ||
          Number(item.costPrice) < 0
        ) {
          alert(
            `Valid cost price is required for item ${index + 1}`
          );
          return;
        }


        finalItems.push({

          productId:
            Number(item.productId),

          batchNumber:
            item.batchNumber.trim(),

          quantity:
            Number(item.quantity),

          costPrice:
            Number(item.costPrice),

          receivedDate:
            item.receivedDate ||
            formData.purchaseDate,

          expiryDate:
            item.expiryDate ||
            null,

          storageLocation:
            item.storageLocation.trim() ||
            null,

        });

      }


      //
      // CREATE PURCHASE
      //

      await createPurchase({

        supplierId:
          Number(formData.supplierId),

        invoiceNumber:
          formData.invoiceNumber.trim(),

        purchaseDate:
          formData.purchaseDate,

        items:
          finalItems,

      }).unwrap();


      alert(
        "Purchase created successfully"
      );

      onClose();


    } catch (error) {

      console.error(error);

      alert(
        error?.data?.message ||
        error?.message ||
        "Failed to create purchase"
      );

    }

  };


  const isSubmitting =
    isCreatingPurchase ||
    isCreatingProduct;


  return (

    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/*
            HEADER
        */}

        <div className="flex justify-between items-center p-6 border-b">

          <div>

            <h2 className="text-xl font-semibold">
              New Purchase
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Record incoming stock from a supplier
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {/*
              PURCHASE INFO
          */}

          <div className="border rounded-xl p-5 mb-6">

            <h3 className="font-semibold mb-4">
              Purchase Information
            </h3>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* SUPPLIER */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Supplier *
                </label>

                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handlePurchaseChange}
                  required
                  disabled={suppliersLoading}
                  className="w-full border rounded-lg px-3 py-2"
                >

                  <option value="">
                    Select supplier
                  </option>

                  {suppliers
                    .filter(
                      (supplier) =>
                        supplier.isActive
                    )
                    .map((supplier) => (

                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </option>

                    ))}

                </select>

              </div>


              {/* INVOICE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Invoice Number *
                </label>

                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handlePurchaseChange}
                  required
                  placeholder="e.g. INV-001"
                  className="w-full border rounded-lg px-3 py-2"
                />

              </div>


              {/* DATE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Purchase Date *
                </label>

                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handlePurchaseChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />

              </div>

            </div>

          </div>


          {/*
              ITEMS
          */}

          <div className="border rounded-xl p-5">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h3 className="font-semibold">
                  Purchase Items
                </h3>

                <p className="text-sm text-gray-500">
                  Add products and their batch details
                </p>

              </div>


              <button
                type="button"
                onClick={addItem}
                className="border px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                + Add Line
              </button>

            </div>


            {/* ITEM LINES */}

            <div className="space-y-5">

              {items.map((item, index) => {

                const selectedProduct =
                  getProduct(
                    item.productId
                  );


                const itemTotal =
                  getItemTotal(item);


                return (

                  <div
                    key={index}
                    className="border rounded-xl p-4 bg-gray-50"
                  >

                    {/* LINE HEADER */}

                    <div className="flex justify-between items-center mb-4">

                      <p className="font-medium">
                        Item {index + 1}
                      </p>


                      {items.length > 1 && (

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>

                      )}

                    </div>


                    {/* PRODUCT + UNIT */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                      {/* PRODUCT */}

                      <div className="md:col-span-2">

                        <label className="block text-sm font-medium mb-1">
                          Product *
                        </label>

                        <select
                          value={
                            newProductIndex === index
                              ? "new"
                              : item.productId
                          }
                          onChange={(e) =>
                            handleProductSelect(
                              index,
                              e.target.value
                            )
                          }
                          disabled={productsLoading}
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        >

                          <option value="">
                            Select product
                          </option>

                          <option
                            value="new"
                            className="font-medium"
                          >
                            + Add New Product
                          </option>

                          {products
                            .filter(
                              (product) =>
                                product.isActive
                            )
                            .map((product) => (

                              <option
                                key={product.id}
                                value={product.id}
                              >
                                {product.name} ({product.sku})
                              </option>

                            ))}

                        </select>

                      </div>


                      {/* UNIT */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Unit
                        </label>

                        <input
                          type="text"
                          value={
                            newProductIndex === index
                              ? newProduct.unit
                              : selectedProduct?.unit ||
                              "-"
                          }
                          readOnly={
                            newProductIndex !== index
                          }
                          onChange={
                            newProductIndex === index
                              ? (e) =>
                                setNewProduct(
                                  (prev) => ({
                                    ...prev,
                                    unit: e.target.value,
                                  })
                                )
                              : undefined
                          }
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>

                    </div>


                    {/* NEW PRODUCT */}

                    {newProductIndex === index && (

                      <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-4">

                        <div className="flex justify-between mb-4">

                          <div>

                            <p className="font-medium text-blue-900">
                              Add New Product
                            </p>

                            <p className="text-xs text-blue-700 mt-1">
                              This product will be added to your product list.
                            </p>

                          </div>


                          <button
                            type="button"
                            onClick={() => {
                              setNewProductIndex(null);
                              handleItemChange(
                                index,
                                "productId",
                                ""
                              );
                            }}
                            className="text-sm text-gray-600 hover:text-black"
                          >
                            Cancel
                          </button>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* NAME */}

                          <div>

                            <label className="block text-sm font-medium mb-1">
                              Product Name *
                            </label>

                            <input
                              type="text"
                              name="name"
                              value={newProduct.name}
                              onChange={handleNewProductChange}
                              placeholder="e.g. CocaCola 500ml"
                              className="w-full border rounded-lg px-3 py-2 bg-white"
                            />

                          </div>


                          {/* SKU */}

                          <div>

                            <label className="block text-sm font-medium mb-1">
                              SKU / Barcode *
                            </label>

                            <input
                              type="text"
                              name="sku"
                              value={newProduct.sku}
                              onChange={handleNewProductChange}
                              placeholder="e.g. COC-500"
                              className="w-full border rounded-lg px-3 py-2 bg-white"
                            />

                          </div>


                          {/* CATEGORY */}

                          <div>

                            <label className="block text-sm font-medium mb-1">
                              Category *
                            </label>

                            <select
                              name="categoryId"
                              value={newProduct.categoryId}
                              onChange={handleNewProductChange}
                              required
                              disabled={categoriesLoading}
                              className="w-full border rounded px-3 py-2"
                            >
                              <option value="">
                                Select category
                              </option>

                              {categories
                                .filter(
                                  (category) => category.isActive
                                )
                                .map((category) => (
                                  <option
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                            </select>

                            <p className="text-xs text-gray-500 mt-1">
                              Category is required by the product model.
                            </p>

                          </div>


                          {/* UNIT */}

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Unit *
                            </label>

                            <select
                              name="unit"
                              value={newProduct.unit}
                              onChange={handleNewProductChange}
                              className="w-full border rounded-lg px-3 py-2 bg-white"
                            >
                              <option value="piece">Piece</option>
                              <option value="kg">Kilogram (kg)</option>
                              <option value="g">Gram (g)</option>
                              <option value="liter">Liter (L)</option>
                              <option value="ml">Milliliter (ml)</option>
                              <option value="pack">Pack</option>
                              <option value="box">Box</option>
                              <option value="dozen">Dozen</option>
                            </select>
                          </div>


                          {/* SELLING PRICE */}

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Selling Price *
                            </label>

                            <input
                              type="number"
                              name="sellingPrice"
                              value={newProduct.sellingPrice}
                              onChange={handleNewProductChange}
                              min="0"
                              step="0.01"
                              placeholder="0"
                              className="w-full border rounded-lg px-3 py-2 bg-white"
                            />
                          </div>

                        </div>

                      </div>

                    )}


                    {/* BATCH DETAILS */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* BATCH */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Batch Number *
                        </label>

                        <input
                          type="text"
                          value={item.batchNumber}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "batchNumber",
                              e.target.value
                            )
                          }
                          placeholder="e.g. B-001"
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>


                      {/* QUANTITY */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Quantity *
                        </label>

                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          min="1"
                          placeholder="0"
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>


                      {/* COST PRICE */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Cost Price *
                        </label>

                        <input
                          type="number"
                          value={item.costPrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "costPrice",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          placeholder="0"
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>


                      {/* RECEIVED DATE */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Received Date
                        </label>

                        <input
                          type="date"
                          value={
                            item.receivedDate
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "receivedDate",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>


                      {/* EXPIRY */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Expiry Date
                        </label>

                        <input
                          type="date"
                          value={
                            item.expiryDate
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "expiryDate",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>


                      {/* LOCATION */}

                      <div>

                        <label className="block text-sm font-medium mb-1">
                          Storage Location
                        </label>

                        <input
                          type="text"
                          value={
                            item.storageLocation
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "storageLocation",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Shelf A1"
                          className="w-full border rounded-lg px-3 py-2 bg-white"
                        />

                      </div>

                    </div>


                    {/* ITEM TOTAL */}

                    <div className="flex justify-end mt-4 pt-3 border-t">

                      <p className="text-sm text-gray-500">

                        Item Total:{" "}

                        <span className="font-semibold text-gray-900">
                          Rs.{" "}
                          {itemTotal.toLocaleString(
                            "en-PK"
                          )}
                        </span>

                      </p>

                    </div>

                  </div>

                );

              })}

            </div>


            {/*
                GRAND TOTAL
            */}

            <div className="flex justify-end mt-6">

              <div className="w-full md:w-80 border rounded-xl p-4 bg-gray-50">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Total Purchase
                  </span>

                  <span className="text-xl font-semibold">
                    Rs.{" "}
                    {grandTotal.toLocaleString(
                      "en-PK"
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/*
              BUTTONS
          */}

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Purchase"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};


export default PurchaseForm;