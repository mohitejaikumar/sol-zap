"use client";
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from "next/navigation";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ZapNode from 'solZap/components/ZapNode';
import { useRecoilState } from 'recoil';
import { availableTriggersAtom } from 'solZap/store/atoms/trigger';
import { availableActionsAtom } from 'solZap/store/atoms/action';
import axios from 'axios';
import { ZapCreateSchema } from 'types';
import { Button } from 'solZap/components/ui/button';





let id = 2;
const getId = () => `${id++}`;


const ZapPage = () => {

    const params = useParams();
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const { screenToFlowPosition } = useReactFlow();
    const [availableTriggers, setAvailableTriggers] = useRecoilState(availableTriggersAtom);
    const [availableActions, setAvailableActions] = useRecoilState(availableActionsAtom);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [zapData, setZapData] = useState<ZapCreateSchema>();
    const [isDone, setIsDone] = useState(false);
    

    const checkIsDone = useCallback(()=>{
        setZapData((prevData)=>{
            if(prevData?.actions && id-1 === Object.keys(prevData.actions).length){
                let flag = false;
                Object.keys(prevData.actions).forEach((key)=>{
                    console.log(prevData.actions[key],prevData.actions[key].actionMetadata.isrem);
                    if((prevData.actions[key].actionMetadata.isrem)){
                        flag = true;
                    }
                })
                if(flag){
                    return prevData;
                }
                if((prevData.triggerMetadata?.isrem)){
                    return prevData;
                }
                console.log("is done");
                setIsDone((prev)=>true);
            }
            return prevData;
        })
        
    },[]);
    
    const onDialogSelect = useCallback((
        type:'Trigger' | 'Action',
        nodeId:string,
        availableItemsId:string,
        availableItemsName:string,
        availableItemsImageURL:string)=>{
        
        setNodes((nds)=>(
                nds.map((node)=>{
                if(node.id === nodeId){
                    return {
                        ...node,
                        data:{ 
                            label: 
                            <ZapNode 
                                imageURL={availableItemsImageURL} 
                                nodeName={availableItemsName} 
                                id={nodeId} 
                                onDialogSelect={onDialogSelect} 
                                setNodes={setNodes}
                                type={'fixed'}
                                onDetailsFilled={onDetailsFilled}
                            /> 
                        }
                    }
                }
                else{
                    return node
                }
            })))

        if(type === 'Trigger'){
            setZapData((prevData)=>{
                return {
                    ...prevData,
                    availableTriggerId:availableItemsId,
                    triggerMetadata:{
                        triggerName:availableItemsName,
                        isrem:true
                    }
                }
            })
        }
        else{
            setZapData((prevData)=>{
                return {
                    ...prevData,
                    actions:{
                        ...prevData.actions,
                        [nodeId]:{
                            availableActionId:availableItemsId,
                            actionMetadata:{
                                actionName:availableItemsName,
                                isrem:true,
                            }
                        }
                    },
                }
            })
        }
        checkIsDone();
    },[]);
    
    const onDetailsFilled = useCallback((
        nodeId:string,
        nodeName:string,
        details:any
    )=>{
        
        if(nodeId === '0'){
            switch(nodeName){
                case 'solana':
                    setZapData((prevData)=>{
                        return {
                            ...prevData,
                            triggerMetadata:{
                                ...prevData.triggerMetadata,
                                isrem:false,
                                address:details.address,
                            }
                        }
                    })
                    break;
                default:
                    break;
            }
        }
        else{
            switch(nodeName){
                case 'email':
                    setZapData((prevData)=>{
                        return {
                            ...prevData,
                            actions:{
                                ...prevData.actions,
                                [nodeId]:{
                                    ...prevData.actions[nodeId],
                                    actionMetadata:{
                                        ...prevData.actions[nodeId].actionMetadata,
                                        isrem:false,
                                        email:details.email_address,
                                    }
                                }
                            }
                        }
                    })
                    break;
                default:
                    break;
            }
        }

        checkIsDone();
    },[]);
    
    const initialNodes = useMemo(()=>[
    {
        id: '0',
        type:'input',
        data: { 
            label: 
            <ZapNode 
                imageURL={""} 
                nodeName="Trigger" 
                id={'0'} 
                onDialogSelect={onDialogSelect} 
                setNodes={setNodes} 
                type={"Trigger"}
                onDetailsFilled={onDetailsFilled}
            /> 
        },
        position: { x: 0, y: -110 },
    },
    {
        id: '1',
        data: { 
            label: 
            <ZapNode 
                imageURL={""} 
                nodeName="Action 1" 
                id={'1'} 
                onDialogSelect={onDialogSelect} 
                setNodes={setNodes} 
                type={"Action"}
                onDetailsFilled={onDetailsFilled}
            /> 
        },
        position: { x: 0, y: 10 },
    },
    ],[]);

    const initialEdges = useMemo(()=>[ { id: 'e0-1', source: '0', target: '1' }],[]);
    
    
    

    useEffect(()=>{
        async function getAvailableTriggersAndActions(){
        
            try{
                const res1 = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/trigger/available`);
                setAvailableTriggers(res1.data.availableTriggers);
                const res2 = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/action/available`);
                setAvailableActions(res2.data.availableActions);
                
            }
            catch(err){
                console.log(err);
            }
        }
        
        setNodes((nds) => nds.concat(initialNodes));
        setEdges(initialEdges);
        setZapData({
            map:{
                "0":["1"],
            },
            availableTriggerId:"",
            triggerMetadata:{},
            actions:{},
        });
        getAvailableTriggersAndActions();
    },[]);


    //@ts-ignore
    const onConnect = useCallback((params) => {
        // reset the start node on connections
        connectingNodeId.current = null;
        //@ts-ignore
        setEdges((eds) => addEdge(params, eds));
    }, []);
    //@ts-ignore
    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectEnd = useCallback(
        //@ts-ignore
        (event) => {
        if (!connectingNodeId.current) return;

        const targetIsPane = event.target.classList.contains('react-flow__pane');

        if (targetIsPane) {
            // we need to remove the wrapper bounds, in order to get the correct position
            const id = getId();
            const newNode = {
            id,
            position: screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            }),
            data: { 
                label: 
                <ZapNode 
                    imageURL={""} 
                    nodeName={`Action ${id}`} 
                    id={id} 
                    onDialogSelect={onDialogSelect} 
                    setNodes={setNodes} 
                    type={"Action"}
                    onDetailsFilled={onDetailsFilled}
                /> 
            },
            origin: [0.0, 0.0],
            };
            //@ts-ignore
            setNodes((nds) => nds.concat(newNode));
            //@ts-ignore
            setEdges((eds) =>[
                ...eds,
                { id: `e${connectingNodeId.current}-${id}`, source: (connectingNodeId.current || '1').toString(), target: id },
            ])
            setIsDone(false);
            setZapData((prevData)=>{
                return {
                    ...prevData,
                    map:{
                        ...prevData.map,
                        [connectingNodeId.current]:(prevData.map[connectingNodeId.current] || []).concat(id),
                    }
                }
            })
        
        }},
        [screenToFlowPosition],
    );

    const onPublish = useCallback(async()=>{
        console.log("publish",zapData);
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/zap`,{
                ...zapData
            });
            console.log(res);
        }
        catch(err){
            console.log(err);
        }
    },[zapData]);


    return (
        <div className="wrapper relative" ref={reactFlowWrapper}>
        <div>{JSON.stringify(zapData)}</div>
        <div className="h-20">
            <Button className="absolute top-5 right-10 bg-black text-white" variant="default" disabled={!isDone} onClick={onPublish}>Publish</Button>
        </div>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            fitView
            fitViewOptions={{ padding: 2 }}
            nodeOrigin={[0.5, 0]}
            
        />
        </div>
    )
}

export default () => (
    <ReactFlowProvider>
        <ZapPage />
    </ReactFlowProvider>
);