import prisma from "db";
import { Router } from "express";
import { CustomRequest, SigninSchema, SignupSchema } from "../types";
import { authMiddleware } from "../middleware";
import jwt from "jsonwebtoken";

const router = Router();

router.post('/signup',async(req:CustomRequest,res)=>{
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(400).json({message:"Invalid Inputs"});;
    }
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:parsedData.data.email,
            }
        })
        if(user){

            res.status(200).json({user:user});
        }
        else{
            const newUser = await prisma.user.create({
                data:{
                    username:parsedData.data.username,
                    password:parsedData.data.password,
                    email:parsedData.data.email,
                }
            })
            res.status(200).json({user:newUser});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})

router.post('/signin',async(req:CustomRequest,res)=>{
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(400).json({message:"Invalid Inputs"});;
    }
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:parsedData.data.email,
            },
        })
        if(user === null){
            return res.status(401).json({message:"User with this email does not exist"});
        }
        if(user.password !== parsedData.data.password){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1h"
        })
        
        res.json({
            token: token,
            user:user
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})

router.get("/", authMiddleware, async (req: CustomRequest, res) => {

    const userId = req.userId;
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            username: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

export default router;