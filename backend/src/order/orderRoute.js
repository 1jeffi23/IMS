import express from "express";
import { confirmOrder, createOrder } from "./orderController.js";

const router = express.Router();

export const createOrderRoute = router.post("/create-order",createOrder);
export const updtaeOrderStatus = router.patch("/confirm/:id",confirmOrder);
