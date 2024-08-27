"use client"

import { useForm } from "react-hook-form"
import { Button } from "../components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import { useMemo, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    email_address: z.string().email({message: "Please enter a valid email address"}).min(2,{message: "Please enter a valid email address"}),
})



export function EmailForm({
    onDetailsFilled,
    nodeName,
    nodeId,
}:{
    onDetailsFilled: (
        nodeId:string,
        nodeName:string,
        details:any
    )=>void,
    nodeName:string,
    nodeId:string
}
) {
    
    
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email_address: "",
        },
    })
    function onSubmit(values:any) {
        onDetailsFilled(nodeId,nodeName,values)
        console.log(values);
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">
            <FormField
            control={form.control}
            name={`email_address`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                    <Input placeholder="email" {...field} />
                </FormControl>
                <FormDescription>
                    Email Address of a person whom you want to send tracking details.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit</Button>
        </form>
        </Form>
    )
}
