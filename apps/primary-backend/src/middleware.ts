import { NextFunction, Response } from "express";
import { CustomRequest } from "./types";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const token = req.headers["authorization"];

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        // const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        //@ts-ignore
        req.userId = "92a013b6-a44a-4a88-9e66-76904c61e543";
        next();
    }
    catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }

}