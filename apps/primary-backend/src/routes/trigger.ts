import prisma from "db";
import { Router } from "express";


const router = Router();


router.get('/available', async(req,res)=>{
    
    try{
        const availableTriggers = await prisma.availableTrigger.findMany({
            where:{}
        });
        res.json({availableTriggers});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})

export default router;