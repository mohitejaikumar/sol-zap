import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import  prisma from 'db';

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
})


async function main(){
    const producer = kafka.producer()
    await producer.connect();
    while(1){
        const pendingZapRuns  = await prisma.zapRunOutbox.findMany({
            where:{},
            take:10,
        })
        console.log(pendingZapRuns)
        // message send to queue 
        producer.send({
            topic:"pipeline-events",
            messages:pendingZapRuns.map(zaps=>{
                return {
                    value:JSON.stringify({zapRunId:zaps.zapRunId, stage:1})
                }
            })
        });
        // delete all processed Zaps 
        await prisma.zapRunOutbox.deleteMany({
            where:{
                zapRunId:{
                    in:pendingZapRuns.map(zaps=>zaps.zapRunId)
                }
            }
        })
        // wait for 4 seconds
        await new Promise(r => setTimeout(r, 4000));
    }
}


main();