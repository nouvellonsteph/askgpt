import React, { useState, useEffect } from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import ReactMarkdown from 'react-markdown'
import gfm from "remark-gfm";

//document.title = 'JAMstack Ask GPT';
const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
    background-color: ${props => (props.darkMode ? "#222" : "#f0f0f0")};
    color: ${props => (props.darkMode ? "#f0f0f0" : "#222")};
  }
  /**
   * ==============================================
   * Dot Flashing
   * ==============================================
   */
  code {
    font-family: monospace;
    font-size: 1em;
    font-weight: bold;

  }
  .linebreaks {
    white-space:pre;            
    }
  .dot-flashing {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #9880ff;
    color: #9880ff;
    animation: dot-flashing 1s infinite linear alternate;
    animation-delay: 0.5s;
  }
  .dot-flashing::before, .dot-flashing::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }
  .dot-flashing::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #9880ff;
    color: #9880ff;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 0s;
  }
  .dot-flashing::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #9880ff;
    color: #9880ff;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 1s;
  }

  @keyframes dot-flashing {
    0% {
      background-color: #9880ff;
    }
    50%, 100% {
      background-color: rgba(152, 128, 255, 0.2);
    }
  }
`;

const ChatContainer = styled.div`
  max-width: 70%;
  margin: 0 auto;
  padding: 20px;
  background-color: ${props => (props.darkMode ? "#333" : "#fff")};
  color: ${props => (props.darkMode ? "#f0f0f0" : "#222")};
  border: 2px solid ${props => (props.darkMode ? "#f0f0f0" : "#222")};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-top: 5px;
  padding: 5px;
  border: 1px solid ${props => (props.darkMode ? "#f0f0f0" : "#222")};
  font-size: 16px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  color: ${props => (props.darkMode ? "#f0f0f0" : "#222")};
  background-color: ${props => (props.darkMode ? "#222" : "#f0f0f0")};
  border: none;
`;

const Chat = ({ content, role, lastTopic, darkMode }) => {
  if (lastTopic) {
    const align = role === "assistant" ? "flex-start" : "flex-end";
    const color = role === "assistant" ? (darkMode ? "rgb(73 65 65)" : "rgb(204, 204, 204)") : "#1e90ff";
    return (
      <div
        className= "dot-flashing" style={{
          //padding: "8px 12px",
          maxWidth: "100%",
          backgroundColor: color,
          color: darkMode ? "#f0f0f0" : "#222",
          borderRadius: "20px",
          alignSelf: align,
          margin: "10px"
          //marginBottom: "10px"
        }}
      >
      </div>
    );
  }
  const align = role === "assistant" ? "flex-start" : "flex-end";
  const color = role === "assistant" ? (darkMode ? "rgb(73 65 65)" : "rgb(204, 204, 204)") : "#1e90ff";
  return (
    <div
      style={{
        padding: "8px 12px",
        maxWidth: "100%",
        backgroundColor: color,
        color: darkMode ? "#f0f0f0" : "#222",
        borderRadius: "20px",
        alignSelf: align,
        whiteSpace: "pre-line",
        marginBottom: "10px",
      }}
    >
      <ReactMarkdown remarkPlugins={[gfm]} children={content}></ReactMarkdown>
    </div>
  );
};

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: flex-end;
  height: 400px;
  position:relative;
  overflow: scroll;
  padding: 10px;
  //border: 2px solid;
`;

const ChatForm = ({ onSubmit, darkMode }) => {
  const [prompt, setPrompt] = useState("");
  const [APIKey, setAPIKey] = useState("");
  const [model, setModel] = useState("");

  useEffect(() => {
    const storedAPIKey = localStorage.getItem("APIKey");
    const storedModel = localStorage.getItem("model");
    if (storedAPIKey) setAPIKey(storedAPIKey);
    if (storedModel) setModel(storedModel);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "APIKey") {
      localStorage.setItem(name, value);
      setAPIKey(value);
    } else if (name === "model") {
      localStorage.setItem(name, value);
      setModel(value);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(APIKey, model, prompt);
    setPrompt("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="APIKey">OpenAI API Key</Label>
      <Input
        type="text"
        name="APIKey"
        value={APIKey}
        onChange={handleChange}
        darkMode={darkMode}
      />
      <Label htmlFor="model">Model version</Label>
      <select
        name="model"
        value={model}
        onChange={handleChange}
        style={{
          marginTop: "5px",
          padding: "5px",
          fontSize: "16px",
          border: `1px solid ${darkMode ? "#f0f0f0" : "#222"}`
        }}
      >
        <option value="gpt-3.5-turbo" defaultValue>GPT3.5-Turbo</option>
      </select>
      <Label htmlFor="prompt">Prompt</Label>
      <Input
        type="text"
        name="prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        darkMode={darkMode}
      />
      <Button type="submit" darkMode={darkMode}>
        Ask GPT
      </Button>
    </Form>
  );
};

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [darkMode, setDarkMode] = useState([]);
  

  const handleFormSubmit = (APIKey, model, prompt) => {
    if (!APIKey) {
      alert("Please enter your OpenAI API key");
      return;
    }
    console.log("model: " + model)
    model = "gpt-3.5-turbo"
    if (!model) {
      alert("Please select a model version");
      return;
    }
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }
    
    setChats([...chats, { content: prompt, role: "user", lastTopic: false }, { content: "...", role: "assistant", lastTopic: true }]);
    
    let conversation = [...chats, {"role": "user", "content": prompt}]
    console.log(conversation)
    const data = { "messages": conversation, model };
    
    axios
      .post(`https://api.openai.com/v1/chat/completions`, data, {
        headers: {
          Authorization: `Bearer ${APIKey}`,
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        const result = res.data.choices[0].message.content;
        conversation = [
          ...chats,
          { content: prompt, role: "user" }, 
          { content: result, role: "assistant" }
        ]
        console.log(res)
        //console.log(conversation)
        setChats(conversation);
      })
      .catch(err => {
        console.log(err);
        resetConversation()
        alert(err.response.data.error.message)
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const resetConversation = () => {
    setChats([])
  };

  return (
    <>
      <title>JAMstack Ask GPT</title>
      <GlobalStyle darkMode={darkMode} />
      <ChatContainer darkMode={darkMode}>
        <h1>GPT-3 Chatbot</h1>
        <ChatBox>
          {chats.map((chat, index) => (
            <Chat {...chat} darkMode={darkMode} key={index} />
          ))}
        </ChatBox>
        <ChatForm onSubmit={handleFormSubmit} darkMode={darkMode} />
        <Button onClick={toggleDarkMode} darkMode={darkMode}>
          {darkMode ? "Switch to Lightmode" : "Switch to Darkmode"}
        </Button>
        <Button style={{margin: "5px"}} onClick={resetConversation} darkMode={darkMode}>
          Reset Conversation
        </Button>
      </ChatContainer>
    </>
  );
};

export default ChatPage;
