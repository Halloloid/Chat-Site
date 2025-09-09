import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000');
const App = () => {
  const [msg,setmsg] = useState([]);
  const [txt,settxt] = useState("");
  const [room,setRoom] = useState("");
  const [user,setUser] = useState("");
  const [typing,setTyping] = useState("");

  useEffect(()=>{
    const handleMessage = (data) => {
      setmsg((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);
    socket.on("typing",(user)=>{
      setTyping(`${user} is Typeing...`)
      setTimeout(()=>setTyping(""),2000)
    });
    return () => {
      socket.off("message", handleMessage);
      socket.off("typing");
    };
  },[])


  const joinroom = () => {
    socket.emit("joinRoom",{room,user});
  }
  const sendmessage = async() =>{
    socket.emit("message",{room ,msg : txt});
    settxt("");
  }


  return (
    <div>
      <input type='text' value={user} onChange={(e)=>{setUser(e.target.value)}}/><br /><br />
      <input type='text' value={room} onChange={(e) => {setRoom(e.target.value)}} />
      <button onClick={joinroom} disabled={(user == "")?true:false} >Join Room</button><br/><br/>
      <input type='text' value={txt} onChange={(e)=>{
        settxt(e.target.value)
        socket.emit("typing",{room,user})
        }}/>
      <button onClick={sendmessage} disabled={(room == "")?true:false} >Submit</button>
      {(user != "")?<p>Your User Name is :{user+socket.id.slice(0,5)}</p>:<p></p>}
      <p style={{ color: "gray" }}>{typing}</p>
      <ul>
      {msg.map((e,i)=>{
        return(
          <li key={i}><span>{e.sender} sent : </span>{e.msg}</li>
        )
      })}
      </ul>
    </div>
  )
}


export default App