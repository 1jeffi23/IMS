import { relations } from "drizzle-orm";

import { category } from "./categoryModel.js";
import { product } from "./productModel.js";
import { productBatch } from "./productBatchModel.js";
import { supplier } from "./supplierModel.js";
import { purchase } from "./purchaseModel.js";
import { purchaseItem } from "./purchaseItemModel.js";
import { sale} from "./saleModel.js";
import {saleItem} from "./saleItemModel.js"


// Category → Products

export const categoryRelations = relations(
  category,
  ({ many }) => ({
    products: many(product),
  })
);


// Product → Category + Batches

export const productRelations = relations(
  product,
  ({ one, many }) => ({
    category: one(category, {
      fields: [product.categoryId],
      references: [category.id],
    }),

    batches: many(productBatch),
  })
);


// Product Batch → Product

export const productBatchRelations = relations(
  productBatch,
  ({ one }) => ({
    product: one(product, {
      fields: [productBatch.productId],
      references: [product.id],
    }),
  })
);


// Supplier → Purchases

export const supplierRelations = relations(
  supplier,
  ({ many }) => ({
    purchases: many(purchase),
  })
);


// Purchase → Supplier + Purchase Items

export const purchaseRelations = relations(
  purchase,
  ({ one, many }) => ({
    supplier: one(supplier, {
      fields: [purchase.supplierId],
      references: [supplier.id],
    }),

    items: many(purchaseItem),
  })
);


// Purchase Item → Purchase + Product + Batch

export const purchaseItemRelations = relations(
  purchaseItem,
  ({ one }) => ({
    purchase: one(purchase, {
      fields: [purchaseItem.purchaseId],
      references: [purchase.id],
    }),

    product: one(product, {
      fields: [purchaseItem.productId],
      references: [product.id],
    }),

    batch: one(productBatch, {
      fields: [purchaseItem.batchId],
      references: [productBatch.id],
    }),
  })
);

export const salesRelations = relations(sale, ({ many }) => ({
  saleItem: many(saleItem),
}));

export const saleItemsRelations = relations(saleItem, ({ one }) => ({
  sale: one(sale, {
    fields: [saleItem.saleId],
    references: [sale.id],
  }),

  product: one(products, {
    fields: [saleItem.productId],
    references: [products.id],
  }),
}));

