import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productApi } from './services/productApi'
import { categoryApi } from './services/categoryApi'
import { productBatchApi } from './services/productBatchApi'
import { supplierApi } from "./services/supplierApi";
import { purchaseApi } from "./services/purchaseApi";

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productBatchApi.reducerPath]: productBatchApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
      concat(productApi.middleware).
      concat(categoryApi.middleware)
      .concat(productBatchApi.middleware)
      .concat(supplierApi.middleware)
      .concat(purchaseApi.middleware),
})

setupListeners(store.dispatch)