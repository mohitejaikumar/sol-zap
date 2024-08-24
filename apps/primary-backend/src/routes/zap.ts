import prisma from "db";
import { Router } from "express";
import { CustomRequest } from "../types";
import { ZapCreateSchema } from "types";
import { authMiddleware } from "../middleware";
import { Queue } from "../helpers/queue";
import axios from "axios";


const router = Router();
router.use(authMiddleware);

router.post('/', async(req:CustomRequest,res)=>{
    
        const userId = req.userId;
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);
        if(!parsedData.success){
            return res.status(400).json({message:"Invalid Inputs"});;
        }

        try{
            const zapData = await prisma.$transaction(async(tx)=>{
                // create zap 
                const zap = await tx.zap.create({
                    data:{
                        userId:userId as string,
                        timestamp:new Date(),
                    }
                })

                // create trigger 
                const trigger = await tx.trigger.create({
                    data:{
                        availableTriggerId:parsedData.data.availableTriggerId,
                        zapId:zap.id,
                        metadata:parsedData.data.triggerMetadata,
                    }
                })

                // create actions
                const actionMap = parsedData.data.map;
                const actions = parsedData.data.actions;
                const actionsQueue = new Queue<{actionId:string,orderId:number,actionKey:string}>();
                // write bfs code to create actions 
                // entered baseActions in queue 
                console.log(actionMap);
                console.log(actionMap["0"]);
                for(let i=0; i<actionMap["0"].length; i++){
                    const baseActionKey = actionMap["0"][i];
                    const baseActionData = actions[baseActionKey];
                    console.log(baseActionData);
                    const baseAction = await tx.action.create({
                        data:{
                            availableActionId:baseActionData.availableActionId,
                            zapId:zap.id,
                            metadata:baseActionData.actionMetadata,
                            orderId:1,
                        }
                    })
                    actionsQueue.enqueue({actionId:baseAction.id,orderId:1,actionKey:baseActionKey});
                }
                // bfs to create child actions
                while(!actionsQueue.isEmpty()){
                    const parentAction = actionsQueue.dequeue();
                    if(!parentAction){
                        break;
                    }
                    if(actionMap[parentAction.actionKey] === undefined){
                        continue;
                    }
                    // create child action and push it to queue 
                    for(let i=0; i<actionMap[parentAction.actionKey].length; i++){
                        const childActionKey = actionMap[parentAction.actionKey][i];
                        const childActionData = actions[childActionKey];
                        const childAction = await tx.action.create({
                            data:{
                                availableActionId:childActionData.availableActionId,
                                zapId:zap.id,
                                metadata:childActionData.actionMetadata,
                                orderId:parentAction.orderId+1,
                                parentId:parentAction.actionId,
                            }
                        })
                        // push to queue
                        actionsQueue.enqueue({actionId:childAction.id,orderId:parentAction.orderId+1,actionKey:childActionKey});
                    }
                }
                return zap;
            },
            {
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
        });
            // const webhookRes = await axios.post(`${process.env.WEBHOOK_URL}/createSolHook`,{
            //     addressArray:[...(parsedData.data.triggerMetadata?.address)],
            // })
            // console.log(webhookRes);

            res.status(200).json({zap:zapData});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message:"SERVER ERROR"});
        }

})

router.get('/', async(req:CustomRequest,res)=>{
    const userId = req.userId;
    try{
        const zaps = await prisma.zap.findMany({
            where:{
                userId:userId,
            },
            include:{
                trigger:{
                    include:{
                        type:true,
                    },
                },
                actions:{
                    include:{
                        type:true,
                    }
                },
            },
        })
        res.status(200).json({zaps:zaps});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})

router.get('/:zapId', async(req:CustomRequest,res)=>{
    const userId = req.userId;
    const zapId = req.params.zapId;
    try{
        const zap = await prisma.zap.findUnique({
            where:{
                id:zapId,
                userId:userId,
            },
            include:{
                trigger:{
                    include:{
                        type:true,
                    },
                },
                actions:{
                    include:{
                        type:true,
                    }
                },
            },
        });
        res.status(200).json({zap:zap});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"SERVER ERROR"});
    }
})
export default router;