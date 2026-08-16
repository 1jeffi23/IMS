import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productApi } from './features/products/productApi'
import { productBatchApi } from './features/products/productBatchApi'

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
     [productBatchApi.reducerPath]: productBatchApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware).concat(productBatchApi.middleware),
})

setupListeners(store.dispatch)