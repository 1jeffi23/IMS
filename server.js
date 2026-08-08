import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/user/auth/auth.js";
const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/",(req,res)=>{
    return res.send('hey');
})

app.use(express.json());


app.listen(3000,()=> console.log('server running'))
