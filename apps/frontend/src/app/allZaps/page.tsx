"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AllZapsPage(){

    const {data:session} = useSession();
    const [allZaps , setAllZaps] = useState();
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
        <div className="mt-16">Create Zap Page</div>
        <div>{JSON.stringify(session)}</div>
        <div>{JSON.stringify(allZaps)}</div>
        </>
    )
}