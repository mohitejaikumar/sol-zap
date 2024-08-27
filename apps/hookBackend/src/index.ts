import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import prisma from "db";
import axios from "axios";
import { SolanaMetadata } from "metadata";

const app = express();

app.use(cors());
app.use(express.json());

const HELIUS_KEY_ID = process.env.HELIUS_KEY_ID;

app.post("/solHook", async (req,res)=>{
    
    
    const solTransferData = req.body;
    // console.log(JSON.stringify(solTransferData, null, 2));
    console.log(solTransferData[0].description);
    const feePayer = solTransferData[0].feePayer;

    // dump this into database in zap and zapRun both (outbox pattern)
    
    await prisma.$transaction(async (tx)=>{
        const zaps = await tx.availableTrigger.findMany({
            where:{
                name:"solana"
            },
            include:{
                triggers:{
                    include:{
                        zap:true,
                    },
                    where:{
                        metadata:{
                            path:["address"],
                            array_contains:[feePayer]
                        }
                    }
                },
            }
        })
        console.log(zaps);
        for(const trigger of zaps[0].triggers){
            const zapRun = await tx.zapRun.create({
                data:{
                    zapId:trigger.zapId,
                    metadata:{description:solTransferData[0].description},
                    timestamp: new Date(),
                },
            })
            const zapRunOutbox = await tx.zapRunOutbox.create({
                data:{
                    zapRunId:zapRun.id,
                    timestamp: new Date(),
                },
            })
            console.log(zapRunOutbox,zapRun);
        }
        
    })

    res.status(200).send("Hook got successfully");
})


app.post("/createSolHook", async (req,res)=>{
    // addressArray is an array of wallet address
    const addressArray = req.body.addressArray;
    
    const solTriggers = await prisma.availableTrigger.findMany({
        where:{
            name:"solana"
        },
        include:{
            triggers:{
                include:{
                    zap:true,
                }
            },
        }
    })
    // console.log(solTriggers);
    //@ts-ignore
    let subscribedAddresses = solTriggers[0].triggers.map(trigger=>trigger.metadata?.address).flat();
    subscribedAddresses.push(...addressArray);
    subscribedAddresses = [...new Set(subscribedAddresses)];
    console.log(subscribedAddresses);

    try{
        const response = await axios.put(`https://api.helius.xyz/v0/webhooks/a0021ccf-3204-4e4f-912c-fa891724cbd9?api-key=${HELIUS_KEY_ID}`,{
            "webhookURL": `${process.env.HOOK_URL}/solHook`,
            "transactionTypes": ["Any"],
            "accountAddresses": subscribedAddresses,
            "webhookType": "enhanced", // "enhancedDevnet"
            "txnStatus": "all", // success/failed
            
        })
        console.log(response.data);
        res.json({data:response.data});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
    
})

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});


