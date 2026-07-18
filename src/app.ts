import express, { Application, Request, Response } from "express"


const app : Application = express();

//root route
app.get("/",(req:Request, res: Response)=>{
    res.send("RestNest Server is Running Now")
})

export default app;