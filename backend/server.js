import express from 'express';
import { toNodeHandler } from "better-auth/node";  //Adapter/Bridge that makes Better Auth work with Node.js-style HTTP servers.
//toNodeHandler connects Better Auth with Express/Node.js request-response system.
import { auth } from "./src/user/auth/auth.js";
import { authRoute } from './src/user/auth/authRoute.js';
const app = express();

//authroute
app.all("/api/auth/*splat", authRoute);

app.use(express.json());

app.get("/",(req,res)=>{
    return res.send('hey');
})




app.listen(3000,()=> console.log('server running'))
