import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";  //Adapter/Bridge that makes Better Auth work with Node.js-style HTTP servers.
//toNodeHandler connects Better Auth with Express/Node.js request-response system.
import { auth } from "./src/user/auth/auth.js";
import { authRoute } from './src/user/auth/authRoute.js';
import {addProductBatchRoute, addProductRoute, getAllProducts} from './src/product/productRoutes.js';
import { createOrderRoute, updtaeOrderStatus } from './src/order/orderRoute.js';
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

app.use("/api/products",addProductRoute);
app.use("/api/products",getAllProducts);
app.use("/api/products",addProductBatchRoute);
app.use("/api/orders",createOrderRoute);
app.use("/api/orders",updtaeOrderStatus);



app.listen(3000,()=> console.log('server running'))
