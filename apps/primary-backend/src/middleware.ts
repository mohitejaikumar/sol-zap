import { NextFunction, Response } from "express";
import { CustomRequest } from "./types";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const token = req.headers["authorization"];
    console.log(req.headers);

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        //@ts-ignore
        req.userId = payload.id;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }

}