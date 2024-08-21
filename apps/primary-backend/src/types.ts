import { Request } from "express";
import z from 'zod';


export interface CustomRequest extends Request{
    userId?: string;
}

export const SignupSchema = z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(6),
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const ActionSchema = z.object({
        availableActionId:z.string(),
        actionMetadata:z.any().optional(),
})

// 0-> is id of Trigger my actions will start from 1,2,3,4 etc .
export const ZapCreateSchema = z.object({
    map:z.record(z.string(),z.array(z.string())),
    availableTriggerId:z.string(),
    triggerMetadata:z.any().optional(),
    actions:z.record(z.string(),ActionSchema),
})
