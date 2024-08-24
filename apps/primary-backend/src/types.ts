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

