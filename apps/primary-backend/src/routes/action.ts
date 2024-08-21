import prisma from "db";
import { Router } from "express";


const router = Router();


router.get('/available', async(req,res)=>{
    
    try{
        const availableActions = await prisma.availableAction.findMany({
            where:{}
        });
        res.json({availableActions});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})

export default router;