"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../components/ui/drawer"

import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import { availableTriggersAtom } from "solZap/store/atoms/trigger";
import { availableActionsAtom } from "solZap/store/atoms/action";
import { SolanaForm } from "./SolanaForm";
import { EmailForm } from "./EmailForm";



export default function ZapNode({
    imageURL,
    nodeName,
    id,
    onDialogSelect,
    setNodes,
    type,
    onDetailsFilled
    
}:{
    imageURL: string,
    nodeName: string,
    id:string,
    onDialogSelect: (
        type:string,
        nodeId: string,
        availableItemsId: string,
        availableItemsName: string,
        availableItemsImageURL: string,
    ) => void,
    setNodes:React.Dispatch<React.SetStateAction<any[]>>,
    type:string,
    onDetailsFilled: (
        nodeId:string,
        nodeName:string,
        details:any
    )=>void
    
}){

    const availableTriggers = useRecoilValue(availableTriggersAtom);
    const availableActions = useRecoilValue(availableActionsAtom);
    

    return (
        <div className="w-full h-full flex gap-4 px-2 py-2 items-center justify-center  relative">
            {imageURL && <img
                src={imageURL}
                width={30}
                height={30}
                className="rounded-full "
            />}  
            <div className="text-lg">{nodeName}</div>
            {(type  === 'Trigger' || type ==='Action') && 
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-6 w-fit bg-slate-200 absolute top-0 left-0">Select</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                        <DialogTitle>Available {type}s</DialogTitle>
                            <DialogDescription>
                                Select an {type} to add to your SolZap
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex flex-col items-center space-x-2">
                            { (type === "Trigger"? availableTriggers : availableActions)
                                .map((item,index)=>{
                                    return (
                                        <div 
                                        className="flex gap-2 items-center cursor-pointer " 
                                        key={index}
                                        onClick={(()=>{
                                            onDialogSelect(type,id,item.id,item.name,item.imageURL);
                                        })}
                                        >
                                            <img
                                                src={item.imageURL}
                                                // alt="zapNode"
                                                width={30}
                                                height={30}
                                                className="rounded-full"
                                            />
                                            <div className="text-lg">{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                            Close
                            </Button>
                        </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            {!(type === 'Trigger' || type === 'Action') && 
                <Drawer direction="right">
                    <DrawerTrigger className="w-full h-full absolute "></DrawerTrigger>
                    <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none overflow-y-auto overflow-x-hidden'>
                        <DrawerClose>
                            <Button variant="outline" className="absolute top-6 right-5">Cancel</Button>
                        </DrawerClose>
                        <DrawerHeader>
                        <DrawerTitle>Please Specify {nodeName.toLocaleUpperCase()} Details</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                        </DrawerHeader>
                        <div className="px-5">
                            {  (nodeName === "solana"?
                            <SolanaForm onDetailsFilled={onDetailsFilled} nodeName={nodeName} nodeId={id} />:
                            (nodeName === "email"?
                            <EmailForm onDetailsFilled={onDetailsFilled} nodeName={nodeName} nodeId={id} />:""))
                            }
                        </div>
                        <DrawerFooter>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            }
            
        </div>
    )
}