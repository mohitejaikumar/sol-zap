"use client";
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';

// Define the Zod schema
const walletSchema = z.object({
    wallets: z.array(
        z.object({
        address: z.string().min(1, "Solana Wallet address to be tracked is required"),
        })
    ),
});

// React component
export const SolanaForm = ({
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
}) => {
  // Initialize the form with react-hook-form and zod validation
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(walletSchema),
        defaultValues: {
        wallets: [{ address: '' }], // Start with one wallet address field
        },
    });

  // Use useFieldArray to manage dynamic fields
    const { fields, append } = useFieldArray({
        control,
        name: 'wallets',
    });

    // Form submission handler
    const onSubmit = (data) => {
        const address = data.wallets.map((item)=>item.address);
        console.log('Submitted Data:', address);
        onDetailsFilled(nodeId,nodeName,{address:address})
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col">
            <label htmlFor={`wallets[${index}].address`} className="text-sm font-medium text-gray-700">
                Wallet Address {index + 1}
            </label>
            <Controller
                name={`wallets.${index}.address`}
                control={control}
                render={({ field }) => (
                <Input
                    {...field}
                    id={`wallets[${index}].address`}
                    placeholder="Solana Wallet Public Key"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                )}
            />
            {errors.wallets && errors.wallets[index] && (
                <p className="text-red-500 text-sm">{errors.wallets[index]?.address?.message}</p>
            )}
            </div>
        ))}

        <Button
            variant="default"
            onClick={() => append({ address: '' })}
            className="bg-black text-white absolute right-5"
        >
            Add +
        </Button>

        <Button type="submit" >
            Submit
        </Button>
        </form>
    );
};


