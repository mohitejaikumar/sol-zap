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
import { CircleX } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DualRing from "../../../../public/DualRing";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
});

const Page = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        const res: any = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        });
        if (res.error) {
        toast({
            title: (
            <div className=" flex gap-2 items-center font-bold">
                <CircleX color="#ff1f1f" />
                Error
            </div>
            ) as any,
            description: res.error,
        });
        } else {
        router.push("/zaps");
        }
    }

    return (
        <>
        <div className=" text-white text-5xl font-semibold">Login</div>
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
                className=" w-full bg-[#4B44AE] hover:bg-[#4B44DE] p-3 text-lg font-medium"
                type="submit"
            >
                {form.formState.isSubmitting ? (
                <div className="flex justify-center items-center gap-2">
                    <DualRing />
                    Logging in
                </div>
                ) : (
                "Login"
                )}
            </Button>
            </form>
        </Form>
        <button className=" text-cyan-400 font-medium">Forgot Password? </button>
        <div className=" text-white flex gap-2 font-normal">
            Don&apos;t have an account?
            <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className=" text-cyan-400 font-semibold cursor-pointer"
            >
            Sign Up
            </button>
        </div>
        </>
    );
};

export default Page;