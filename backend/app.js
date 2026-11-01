import express from "express";

const app=expresse()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen('127.0.0.1:3000',async()=>{
    console.log("服务启动")
})