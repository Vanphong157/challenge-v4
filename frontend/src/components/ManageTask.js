import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  IconButton,
  Modal,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import axios from "axios";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function ManageTask() {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [currentTask, setCurrentTask] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const editOpen = (task) => {
    setCurrentTask(task);
    setTime(task.time);
    setStatus(task.status);
    setTask(task.task);
    setEdit(true);
  };
  const editClose = () => {
    setEdit(false);
    setCurrentTask(null);
    setTime("");
    setStatus("");
    setTask("");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/task/");
      console.log(response.data);
      setTaskData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!task || !time || !status) {
      setAlertType("error");
      setAlertMessage("All fields are required");
      setAlertOpen(true);
      return;
    }
    try {
      await axios.post("http://localhost:4000/task/create", {
        task,
        time,
        status,
      });
      console.log("Task Details:", { task, time, status });
      setAlertType("success");
      setAlertMessage("Task created successfully");
      setAlertOpen(true);
      setTimeout(handleClose, 2000);
      setTimeout(() => {
        setTask("");
        setTime("");
        setStatus("");
      }, 2000);
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error);
      setAlertType("error");
      setAlertMessage("Failed to create task");
      setAlertOpen(true);
    }
  };

  const handleUpdate = async () => {
    if (!task || !time || !status) {
      setAlertType("error");
      setAlertMessage("All fields are required");
      setAlertOpen(true);
      return;
    }

    console.log("Updating Employee with ID:", currentTask.id);
    console.log("Update Data:", {
      id: currentTask.id,
      task,
      time,
      status,
    });

    try {
      await axios.post("http://localhost:4000/task/update", {
        id: currentTask.id,
        task,
        time,
        status,
      });

      setAlertType("success");
      setAlertMessage("Task updated successfully");
      setAlertOpen(true);

      await fetchData();
      editClose();
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to update task");
      setAlertOpen(true);
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/task/delete/${id}`);
      setAlertType("success");
      setAlertMessage("Task deleted successfully");
      setAlertOpen(true);

      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete task");
      setAlertOpen(true);
    }
  };

  const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  };

  return (
    <Container maxWidth="lg">
      <Grid container display={"flex"} flexDirection={"column"}>
        <Grid item>
          <Typography variant="h4">Manage Task</Typography>
        </Grid>
        <Grid container flexDirection={"row"} spacing={2}>
          <Grid item md={6}>
            <Typography>{taskData.length} Task</Typography>
          </Grid>
          <Grid
            item
            md={6}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button variant="contained" onClick={handleOpen}>
              <AssignmentTurnedInIcon></AssignmentTurnedInIcon>
              Create Task
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskData.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>{task.time}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Grid display={"flex"} flexDirection={"row"} gap={1}>
                        <Button
                          variant="outlined"
                          onClick={() => editOpen(task)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleDelete(task.id);
                          }}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                align="center"
              >
                Create Task
              </Typography>
            </Grid>
            <Grid item xs={2} display={"flex"} justifyContent={"end"}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={3}>
            <Grid item xs={12}>
              <TextField
                id="task"
                label="Task"
                variant="outlined"
                fullWidth
                required
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="time"
                label="Deadline"
                variant="outlined"
                fullWidth
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="status"
                label="Status"
                variant="outlined"
                fullWidth
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </Grid>
          </Grid>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={edit}
        onClose={editClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                align="center"
              >
                Edit Task
              </Typography>
            </Grid>
            <Grid item xs={2} display={"flex"} justifyContent={"end"}>
              <IconButton aria-label="close" onClick={editClose}>
                <CloseOutlined />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={3}>
            <Grid item xs={12}>
              <TextField
                id="task"
                label="Task"
                variant="outlined"
                fullWidth
                required
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="time"
                label="Deadline"
                variant="outlined"
                fullWidth
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="status"
                label="Status"
                variant="outlined"
                fullWidth
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </Grid>
          </Grid>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}

export default ManageTask;
