import { Button } from "@material-ui/core";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import firebase from 'firebase'
import { db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function ChatInput({ channelName, channelId, chatRef }) {
  const [user] = useAuthState(auth)
  const [input, setInput] = useState('')

  const sendMessage = (e) => {
    e.preventDefault();

    if (!channelId) {
      alert('please choose a room')
      return false;
      
    }
    if (input === "") {
      return false
    }

    // console.log(input)

    db.collection("rooms").doc(channelId).collection("messages").add({
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
      userImage: user.photoURL,

    });
    
    chatRef?.current?.scrollIntoView({
      behavior: 'smooth'
    })

    setInput('')
  };

  return (
    <ChatInputContainer>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Message #${channelName}`} />
        <Button type="submit">
          Send
        </Button>
      </form>
    </ChatInputContainer>
  );
}

export default ChatInput;

const ChatInputContainer = styled.div`
  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }

  > form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 20px;
    outline: none;
  }
  > form > button {
    display: none;
  }
`;
