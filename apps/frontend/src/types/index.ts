
export interface ActionSchema{
        availableActionId:string,
        actionMetadata?:JSON,
}

// 0-> is id of Trigger my actions will start from 1,2,3,4 etc .
export interface ZapCreateSchema{
    map:Record<string,string[]>,
    availableTriggerId:string,
    triggerMetadata?:JSON,
    actions:Record<string,ActionSchema>,
}