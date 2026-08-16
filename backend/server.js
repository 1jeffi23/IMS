import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";  //Adapter/Bridge that makes Better Auth work with Node.js-style HTTP servers.
//toNodeHandler connects Better Auth with Express/Node.js request-response system.
import { auth } from "./src/user/auth/auth.js";
import { authRoute } from './src/user/auth/authRoute.js';
import { addProductRoute,deleteproduct,  getAllProducts, getProductByid, updateproduct} from './src/product/productRoutes.js';
import { createOrderRoute, updtaeOrderStatus } from './src/order/orderRoute.js';
import { addProductBatchRoute, deleteBatch, getAllBatches, getProdBatchById, updateBatch } from './src/product/productBatchRoutes.js';
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

//authroute
app.all("/api/auth/*splat", authRoute);

app.use(express.json());

// app.get("/",(req,res)=>{
//     return res.send('hey');
// })

app.use("/api/products",getAllProducts);
app.use("/api/products",getProductByid);
app.use("/api/products",addProductRoute);
app.use("/api/products",updateproduct);
app.use("/api/products",deleteproduct);

app.use("/api/prod_batches",addProductBatchRoute);
app.use("/api/prod_batches",getAllBatches);
app.use("api/prod_batches",getProdBatchById);
app.use("/api/prod_batches",updateBatch);
app.use("/api/prod_batches",deleteBatch);

app.use("/api/orders",createOrderRoute);
app.use("/api/orders",updtaeOrderStatus);



app.listen(3000,()=> console.log('server running'))
