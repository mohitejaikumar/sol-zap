import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import prisma from "db";
import { sendEmail } from "./sendEmail";

const kafka = new Kafka({
    clientId: 'worker-1',
    brokers: ['localhost:9092']
});

// 2a6a4262-cd6d-4b5c-93fc-9e6de48f4d08

const TOPIC_NAME = "pipeline-events";
async function main(){

    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer =  kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

    await consumer.run({
        autoCommit: false,
        eachMessage:async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });
            if(!message.value){
                return;
            }
            const parsedData = JSON.parse(message.value?.toString());
            const zapRunId = parsedData.zapRunId;
            const stage = parsedData.stage;
            console.log(zapRunId,stage);

            // search from ZapRun 
            const zapRunData = await prisma.zapRun.findFirst({
                where: {
                id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    },
                }
            });
            // console.log(JSON.stringify(zapRunData, null, 2));

            const currentActions = zapRunData?.zap.actions.filter((action)=>action.orderId == stage);
            if (!currentActions) {
                console.log("action not found");
                return;
            }

            for(let i=0;i<currentActions.length;i++){
                const action = currentActions[i];
                if(action.type.name === "email"){
                    // send an email
                    //@ts-ignore
                    const body =  zapRunData.metadata?.description;
                    console.log("inside for loop");
                    //@ts-ignore
                    if(body && action.metadata?.email){
                        
                        //@ts-ignore
                        console.log(body , action.metadata?.email);
                        //@ts-ignore
                        await sendEmail(action.metadata.email, body.description);
                    }
                    
                }
                // wait for some time
                await new Promise(r => setTimeout(r, 500));
            }
            
            // put next stage childs into queue
            const nextStageActions = zapRunData?.zap.actions.filter((action)=>action.orderId == stage+1);
            
            if(nextStageActions){
                if(nextStageActions.length > 0){
                    // put next stage childs into queue
                    await producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                            value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId:zapRunId
                            })
                        }]
                    });  
                }
            }

            // commit this stage 
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString() 
            }]);
            console.log("committed");

        }
    })

}

main();


