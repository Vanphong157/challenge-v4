const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { Employee, Task, Chat } = require("./config");
const app = express();
const sendOtpEmail = require("./sendOtpEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const http = require("http");
app.use(express.json());
app.use(cors());
const SECRET_KEY = "VANPHONG";
const server = http.createServer(app);
const io = new Server(server, {
  // Đặt cổng cho Socket.IO
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (data) => {
    io.to(data.chatId).emit("receive_message", data.message);
  });

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/employee", async (req, res) => {
  try {
    const snapshot = await Employee.get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(list);
    res.send(list);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).send({ error: "Failed to fetch employees" });
  }
});

app.get("/chat", async (req, res) => {
  try {
    const snapshot = await Chat.get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(list);
    res.send(list);
  } catch (error) {
    z``;
    console.error("Error fetching employees:", error);
    res.status(500).send({ error: "Failed to fetch employees" });
  }
});

app.get("/chat/:id", async (req, res) => {
  const chatId = req.params.id;

  try {
    const snapshot = await Chat.doc(chatId).get();

    if (!snapshot.exists) {
      res.status(404).send({ error: "Chat not found" });
      return;
    }

    const chatData = {
      id: snapshot.id,
      ...snapshot.data(),
    };

    console.log(chatData);
    res.send(chatData);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).send({ error: "Failed to fetch chat" });
  }
});
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

app.post("/employee/login", async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    const snapshot = await Employee.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).send({ error: "Invalid email" });
    }

    const doc = snapshot.docs[0];
    await Employee.doc(doc.id).update({ otp: otp });
    sendOtpEmail(email, otp);

    res.send({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Failed to log in" });
  }
});

app.post("/employee/create", async (req, res) => {
  const data = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    await Employee.add({ ...data, otp });

    sendOtpEmail(data.email, otp);
    res.send({ msg: "Employee added" });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).send({ error: "Failed to create employee" });
  }
});

app.post("/employee/update", async (req, res) => {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res.status(400).send({ error: "ID is required" });
    }
    await Employee.doc(id).update(data);
    res.send({ msg: "Employee updated" });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).send({ error: "Failed to update employee" });
  }
});

app.delete("/employee/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Employee.doc(id).delete();
  res.send({ msg: "Employee deleted" });
});

app.get("/task", async (req, res) => {
  try {
    const snapshot = await Task.get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(list);
    res.send(list);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).send({ error: "Failed to fetch employees" });
  }
});

app.post("/task/create", async (req, res) => {
  const data = req.body;
  await Task.add(data);
  res.send({ msg: "Task added" });
});

app.post("/task/update", async (req, res) => {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res.status(400).send({ error: "ID is required" });
    }
    await Task.doc(id).update(data);
    res.send({ msg: "Task updated" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ error: "Failed to update task" });
  }
});

app.delete("/task/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Task.doc(id).delete();
  res.send({ msg: "Task deleted" });
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const snapshot = await Employee.where("email", "==", email)
      .where("otp", "==", otp)
      .get();

    if (snapshot.empty) {
      return res.status(400).send({ error: "Invalid OTP" });
    }

    const doc = snapshot.docs[0];
    await Employee.doc(doc.id).update({ otp: null });

    const user = doc.data();
    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.send({ msg: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ error: "Failed to verify OTP" });
  }
});
app.listen(4000, () => console.log("4000"));
io.listen(9002);
