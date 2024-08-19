


export interface SolanaMetadata {
    zapId:string,
    userId:string,
    nativeTransfers:{
        amount: number,
        fromUserAccount: string,
        toUserAccount: string
    }[],
    description:string,
}


