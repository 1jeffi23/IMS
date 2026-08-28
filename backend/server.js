import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";  //Adapter/Bridge that makes Better Auth work with Node.js-style HTTP servers.
//toNodeHandler connects Better Auth with Express/Node.js request-response system.
import { auth } from "./utils/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { authRoute } from './src/routes/authRoute.js';
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import productBatchRoutes from "./src//routes/productBatchRoutes.js";
import supplierRoutes from "./src/routes/supplierRoutes.js";
import purchaseRoutes from "./src/routes/purchaseRoutes.js";
import customerRoutes from "./src/routes/customerRoutes.js";
import saleRoutes from "./src/routes/saleRoutes.js";
import auditLogRoutes from "./src/routes/auditLogRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import expenseRoutes from "./src/routes/expenseRoutes.js";
import accountingRoutes from "./src/routes/accountingRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { setupSocketServer } from './src/socket/socketServer.js';



const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));

//authroute
app.all("/api/auth/*splat", authRoute);

app.use(express.json());

const httpServer = createServer(app);


const io = new Server(httpServer, {
 
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

setupSocketServer(io);



app.use("/api/chat", chatRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-batches", productBatchRoutes);
app.use( "/api/suppliers", supplierRoutes);
app.use( "/api/purchases",purchaseRoutes);
app.use( "/api/customers",customerRoutes);
app.use( "/api/sales",saleRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses",expenseRoutes)
app.use("/api/accounting", accountingRoutes);


httpServer.listen(3000,()=> console.log('server running'))
