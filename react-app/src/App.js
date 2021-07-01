import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/lib/Col";
import FormControl from "react-bootstrap/lib/FormControl";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar,
} from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import "./index.css";
import io from "socket.io-client";
import "react-notifications/lib/notifications.css";

const SOCKET_URI = process.env.REACT_APP_SERVER_URI;

export default function App() {
  const socket = io.connect(SOCKET_URI);
  const [userChatData, setuserChatData] = useState([]);
  const [messageText, setmessageText] = useState("");

  useEffect(() => {
    setupSocketListeners();
    return () => socket.on("disconnect");
  }, []);

  function setupSocketListeners() {
    socket.on("message", onMessageRecieved);
  }

  function onMessageRecieved(message) {
    let messageData = {
      position: "left",
      type: "text",
      text: message,
    };

    setuserChatData((state) => [...state, messageData]);
  }

  function createMessage(msg) {
    socket.emit("message", msg);
    setmessageText("");
  }

  function onMessageKeyPress(e) {
    if (e.key === "Enter") {
      alert("here");
      createMessage(messageText);
    }
  }

  function onMessageInputChange(e) {
    setmessageText(e.target.value);
  }

  return (
    <div>
      <div>
        <div>
          <NavbarComponent
            left={
              <div>
                <Col mdHidden lgHidden>
                  <p className="navBarText">
                    <Glyphicon glyph="chevron-left" />
                  </p>
                </Col>
                <Avatar alt={"logo"} size="large" type="circle flexible" />
                <p className="navBarText">User</p>
              </div>
            }
          />
          <MessageList
            className="message-list"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={userChatData}
          />
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                value={messageText}
                onChange={onMessageInputChange}
                onKeyPress={onMessageKeyPress}
                placeholder="Type a message here (Limit 3000 characters)..."
                // ref="messageTextBox"
                className="messageTextBox"
                maxLength="3000"
                autoFocus
              />
              <InputGroup.Button>
                <Button
                  disabled={!messageText}
                  className="sendButton"
                  onClick={() => createMessage(messageText)}
                >
                  Send
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </div>
      </div>
    </div>
  );
}
