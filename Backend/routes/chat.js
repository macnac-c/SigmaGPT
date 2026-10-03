import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//test route
router.post("/test" , async(req , res) => {
    try{
        const thread = new Thread({
            threadId : "123abc" , 
            title : "Testing New Thread3"
        });

        const response = await thread.save();
        res.send(response);
    }

    catch(err){
        console.log(err);
        res.status(500).json({error : "failed to save in DB"});
    }
});

//GET - to get all threads route
router.get("/thread" , async(req , res) => {
    try{

        //sorting the threads based on updatedAt
        const threads = await Thread.find({}).sort({updatedAt : -1});
        res.json(threads);
    }

    catch(err){
        console.log(err);
        res.status(500).json({error : "failed to fetch threads"});
    }
});

//GET - to get a specific thread
router.get("/thread/:threadId" , async(req , res) => {
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        //in cas eof invalid threadId
        if(!thread){
            res.status(404).json({error : "Thread not found"});
        }

        res.json(thread.messages);
    }

    catch(err){
        console.log(err);
        res.status(500).json({error : "failed to fetch chat"});
    }
});

//DELETE - to delete a specific thread
router.delete("/thread/:threadId" , async(req , res) => {
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        console.log(deletedThread);

        if(!deletedThread){
            res.status(404).json({error : "Thread could not be deleted"});
        }

        res.status(200).json({success : "Thread deleted successfully"});
    }

    catch(err){
        console.log(err);
        res.status(500).json({error : "failed to delete thread"});
    }
});

//POST - to create a new thread or to modify the existing thread
router.post("/chat" , async(req , res) => {
    const {threadId , message} = req.body;

    //validate fields
    if(!threadId || !message){
        res.status(400).json({error : "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        //create new thread in DB
        if(!thread){
            thread = new Thread({
                threadId ,
                title : message ,
                messages : [{role : "user" , content : message}]
            })
        }

        //modify existing thread in DB
        else{
            thread.messages.push({role : "user" , content : message});
        }

        //get OPENAI response
        const assistantReply = await getOpenAIAPIResponse(message);

        //store response in DB
        thread.messages.push({role : "assistant" , content : assistantReply});

        //update the updatedAt field
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply : assistantReply});
    }

    catch(err){
        console.log(err);
        res.status(500).json({error : "something went wrong"});
    }
});

export default router;