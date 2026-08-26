import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productApi } from './services/productApi'
import { categoryApi } from './services/categoryApi'
import { productBatchApi } from './services/productBatchApi'
import { supplierApi } from "./services/supplierApi";
import { purchaseApi } from "./services/purchaseApi";
import { saleApi } from './services/saleApi'
import { customerApi } from './services/customerApi'
import { auditLogApi } from './services/auditLogApi'
import { userApi } from './services/userApi'
import { expenseApi } from './services/expenseApi'
import { accountingApi } from './services/accountingApi'
import { chatApi } from './services/chatApi'

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productBatchApi.reducerPath]: productBatchApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [saleApi.reducerPath]:saleApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [auditLogApi.reducerPath]: auditLogApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [accountingApi.reducerPath]: accountingApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
      concat(productApi.middleware).
      concat(categoryApi.middleware)
      .concat(productBatchApi.middleware)
      .concat(supplierApi.middleware)
      .concat(purchaseApi.middleware)
      .concat(saleApi.middleware)
      .concat(customerApi.middleware)
      .concat(auditLogApi.middleware)
      .concat(userApi.middleware)
      .concat(expenseApi.middleware)
      .concat(accountingApi.middleware)
      .concat(chatApi.middleware),
})

setupListeners(store.dispatch)