import z from 'zod';


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


export interface ActionSchema{
        availableActionId:string,
        actionMetadata?:any,
}


// 0-> is id of Trigger my actions will start from 1,2,3,4 etc .
export interface ZapCreateSchema{
    map:Record<string,string[]>,
    availableTriggerId:string,
    triggerMetadata?:any,
    actions:Record<string,ActionSchema>,
}