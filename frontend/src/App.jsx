import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000');
const App = () => {
  const [msg,setmsg] = useState([]);
  const [txt,settxt] = useState("");
  const [room,setRoom] = useState("");

  useEffect(()=>{
    const handleMessage = (data) => {
      setmsg((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage); 
    };
  },[])


  const joinroom = () => {
    socket.emit("joinRoom",room);
  }
  const sendmessage = async() =>{
    socket.emit("message",{room ,msg : txt});
    settxt("");
  }

  console.log(msg);

  return (
    <div>
      <input type='text' value={room} onChange={(e) => {setRoom(e.target.value)}} />
      <button onClick={joinroom}>Join Room</button><br/><br/>
      <input type='text' value={txt} onChange={(e)=>{settxt(e.target.value)}}/>
      <button onClick={sendmessage} disabled={(room == "")?true:false} >Submit</button>
      {msg.map((e,i)=>{
        return(
          <p key={i}><span>{e.sender} sent : </span>{e.msg}</p>
        )
      })}
    </div>
  )
}


export default App