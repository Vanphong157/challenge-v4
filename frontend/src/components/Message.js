import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Paper,
  Box,
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import { MoreOutlined, Send as SendIcon } from "@mui/icons-material";
import io from "socket.io-client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  getFirestore,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { jwtDecode } from "jwt-decode";
import dateFormat from "../assistants/date.Format";
const firebaseConfig = {
  apiKey: "AIzaSyDNKm71S9em0FiclHu3Mo8F1aD-FoZnEMU",
  authDomain: "my-app-4c69f.firebaseapp.com",
  projectId: "my-app-4c69f",
  storageBucket: "my-app-4c69f.appspot.com",
  messagingSenderId: "143091395672",
  appId: "1:143091395672:web:de19d79d162542680f2e2d",
  measurementId: "G-TGYLGMZZVJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const socket = io("http://localhost:9002");

function Message() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    if (role) {
      setRole(role);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [userEmail]);

  const fetchEmployees = async () => {
    try {
      const empCollection = collection(db, "Employees");
      const empSnapshot = await getDocs(empCollection);
      const employees = empSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employees.filter((user) => user.email !== userEmail));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const userId = userEmail || "Admin";
    const selectedUserId = selectedChat.email || selectedChat.phoneNumber;

    const chatId = getChatId(userId, selectedUserId);
    const messageData = {
      time: Timestamp.fromDate(new Date()),
      value: newMessage,
      sender: userId,
    };

    try {
      const chatDocRef = doc(db, "Chats", chatId);
      const chatDoc = await getDoc(chatDocRef);

      let chatContent = [];
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        if (Array.isArray(chatData.content)) {
          chatContent = chatData.content;
        }
      }

      const updatedContent = [...chatContent, messageData];

      await setDoc(
        chatDocRef,
        {
          users: [userId, selectedUserId],
          content: updatedContent,
        },
        { merge: true }
      );

      socket.emit("send_message", { chatId, message: messageData });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getChatId = (id1, id2) => {
    return [id1, id2].sort().join("_");
  };

  const handleListChatClick = (user) => {
    const selectedUserId = user.email || user.phoneNumber;
    setSelectedChat(user);

    const chatId = getChatId(userEmail || "Admin", selectedUserId);
    const chatDocRef = doc(db, "Chats", chatId);
    console.log("a", chatDocRef);
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.content || []);
      } else {
        setMessages([]);
      }
    });

    socket.emit("join_chat", chatId);

    return () => unsubscribe();
  };

  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (selectedChat) {
        const chatId = getChatId(userEmail, selectedChat.email);
        if (message.chatId === chatId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedChat, userEmail]);

  // const dateFormat = (date, format) => {
  //   return date.toLocaleDateString();
  // };
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log("message:", messages);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item md={4} borderRight={"1px #ccc solid"} paddingRight={1}>
          <Typography variant="h4" gutterBottom align="center">
            CHAT
          </Typography>
          <Paper
            component="form"
            elevation={3}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 220,
              marginBottom: 2,
              borderRadius: 8,
            }}
          >
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
          </Paper>
          <Grid display={"flex"} borderTop={"1px #ccc solid"}>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                height: "610px",
                overflow: "auto",
              }}
            >
              {employees.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItemButton
                    alignItems="flex-start"
                    selected={selectedChat?.id === user.id}
                    onClick={() => handleListChatClick(user)}
                  >
                    <Avatar src={user.avatar} />{" "}
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          ></Typography>
                          {user.email}
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
        <Grid item md={8} paddingLeft={1}>
          {selectedChat ? (
            <Grid container>
              <Grid
                container
                display={"flex"}
                justifyContent={"space-between"}
                padding={"8px 0"}
                borderBottom={"1px #ccc solid"}
              >
                <Grid
                  item
                  xs={6}
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Avatar src={selectedChat.avatar} /> {selectedChat.name}
                </Grid>
                <Grid item xs={6} display={"flex"} justifyContent={"end"}>
                  <IconButton aria-label="delete">
                    <MoreOutlined />
                  </IconButton>
                </Grid>
              </Grid>
              <>
                <Box height={590} overflow="auto">
                  {Array.isArray(messages) &&
                    messages.map((msg, index) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          maxWidth: "450px",
                          width: "100%",
                          minWidth: "450px",
                        }}
                      >
                        <Typography
                          style={{
                            alignSelf:
                              (role === "admin" && msg.sender === "Admin") ||
                              msg.sender === userEmail
                                ? "flex-end"
                                : "flex-start",
                            margin: "0 1rem",
                            fontWeight: "bold",
                          }}
                        >
                          {msg.sender}
                        </Typography>
                        <Typography
                          key={index}
                          style={{
                            padding: "10px",
                            backgroundColor:
                              (role === "admin" && msg.sender === "Admin") ||
                              msg.sender === userEmail
                                ? "#e1ffc7"
                                : "#ccc",
                            margin:
                              // (role === "admin" && msg.sender === "Admin") ||
                              // msg.sender === userEmail
                              // ?
                              //  "0.5rem 1rem 0.5rem 23rem"
                              // :
                              "0.5rem 1rem",
                            borderRadius: "12px",
                            width: "fit-content",
                            alignSelf:
                              (role === "admin" && msg.sender === "Admin") ||
                              msg.sender === userEmail
                                ? "flex-end"
                                : "flex-start",
                            maxWidth: "70%",
                            wordWrap: "break-word",
                          }}
                        >
                          {msg.value}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "10px",
                            fontStyle: "italic",
                            margin: " 0 1rem",
                            alignSelf:
                              (role === "admin" && msg.sender === "Admin") ||
                              msg.sender === userEmail
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          {dateFormat(new Date(), "HH:MM")}{" "}
                          {dateFormat(new Date(), "mmmm dd, yyyy")}
                        </Typography>
                      </div>
                    ))}
                  <div ref={endRef}></div>
                </Box>
              </>
              <Paper
                component="form"
                elevation={3}
                sx={{
                  padding: "0.5rem",
                  maxWidth: "600px",
                  marginTop: "2rem",
                  display: "flex",
                  width: "100%",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: "5px" }}
                  aria-label="send"
                  onClick={handleSendMessage}
                >
                  <SendIcon />
                </IconButton>
              </Paper>
            </Grid>
          ) : (
            <Typography variant="h6" align="center">
              Select a chat to view messages
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Message;
