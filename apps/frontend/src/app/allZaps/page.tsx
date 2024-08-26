"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { Button } from "solZap/components/ui/button";
import { useRouter } from "next/navigation";



const Page = () => {

    const {data:session} = useSession();
    const [allZaps , setAllZaps] = useState([]);
    const router = useRouter();
    //@ts-ignore
    const token = session?.user?.jwtToken;

    useEffect(()=>{
        
        async function getAllZaps(){
            try{
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/zap/`,{
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                });
                console.log(res.data);
                setAllZaps(res.data.zaps);
            }
            catch(err){
                console.log(err);
            }
        }

        getAllZaps();
    },[token]);





    
    return (
        <>
        <div className="mt-16"></div>
        <div className=" w-full h-fit mt-20 flex justify-end px-11" >
            <Button className="bg-black text-white cursor-pointer" variant="default"  onClick={()=>router.push('/zaps')}>Create +</Button>
        </div>
        <div className="flex justify-center  w-screen mt-10">
            <Table className="max-w-[800px] mx-auto">
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[200px]">Id</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Action Count</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allZaps && allZaps.map((zap,index)=>{
                        return (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{zap.id}</TableCell>
                            <TableCell>{zap.trigger.type.name}</TableCell>
                            <TableCell>{zap.actions[0].type.name}</TableCell>
                            <TableCell>{zap.actions.length}</TableCell>
                            <TableCell className="text-right">{new Date(zap.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                        )
                    })
                    }
                    
                </TableBody>
            </Table>
        </div>
        </>
    )
}

export default Page;