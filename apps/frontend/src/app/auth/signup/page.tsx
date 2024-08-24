"use client";
import { Button } from "../../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useToast } from "../../../components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CircleCheck, CircleX, Route } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DualRing from "../../../../public/DualRing";

const signUpSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3, "Name must be atleast 3 characters"),
    password: z
        .string()
        .min(8, "Password must be atleast 8 characters")
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain atleast one uppercase, one lowercase, one number and one special character"
        ),
});

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        try {
        const registerResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/signup`,
            values
        );
        toast({
            title: (
            <div className=" flex gap-2 items-center font-bold">
                <CircleCheck color="#05ff50" />
                Successful
            </div>
            ) as any,
            description: `Account created successfully`,
        });
        toast({
            title: (
            <div className=" flex gap-2 items-center font-bold">
                <Route color="#282ff0" />
                Redirecting
            </div>
            ) as any,
            description: `Login to Continue`,
        });
        router.push("/auth/login");
        } catch (error: any) {
        toast({
            title: (
            <div className=" flex gap-2 items-center font-bold">
                <CircleX color="#ff1f1f" />
                Error
            </div>
            ) as any,
            description: `${error?.response?.data?.message}`,
        });
        console.error("Error occurred:", error);
        }
    }
    return (
        <>
        <div className=" text-white text-5xl font-semibold">Sign Up</div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        className=" bg-transparent text-white font-medium text-lg"
                        placeholder="Email"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        className=" bg-transparent text-white font-medium text-lg"
                        placeholder="Name"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        type="password"
                        className="bg-transparent text-white font-medium text-lg"
                        placeholder="Password"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button
                className=" w-full bg-[#4B44AE] hover:bg-[#4B44DE] text-lg font-medium"
                type="submit"
            >
                {form.formState.isSubmitting ? (
                <div className="flex justify-center items-center gap-2">
                    <DualRing />
                    Signing Up
                </div>
                ) : (
                "Sign Up"
                )}
            </Button>
            </form>
        </Form>
        <button className=" text-cyan-400 font-medium">Forgot Password? </button>
        <div className=" text-white flex gap-2 font-normal">
            Already have an account?
            <button
            onClick={() => router.push("/auth/signin")}
            type="button"
            className=" text-cyan-400 font-semibold cursor-pointer"
            >
            {" "}
            Sign In
            </button>{" "}
        </div>
        </>
    );
};

export default Page;