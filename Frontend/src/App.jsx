import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [prompt , setPrompt] = useState("");
  const [reply , setReply] = useState(null);
  const [currThreadId , setCurrThreadId] = useState(uuidv4());
  const [prevChats , setPrevChats] = useState([]); //stores all chats of curr thread
  const [newChat , setNewChat] = useState(true); //for a new thread
  const [allThreads , setAllThreads] = useState([]); //to display thread history

  //provides values
  const providerValues = {
    prompt , setPrompt ,
    reply , setReply ,
    currThreadId , setCurrThreadId ,
    prevChats , setPrevChats ,
    newChat , setNewChat ,
    prevChats , setPrevChats ,
    allThreads , setAllThreads
  };

  return (
    <div className="app">
      <MyContext.Provider value = {providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App