import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import axios from "axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

function ManageEmployee() {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [employee, setEmployee] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const editOpen = (employee) => {
    setCurrentEmployee(employee);
    setName(employee.name);
    setPhone(employee.phone);
    setEmail(employee.email);
    setRole(employee.role);
    setAddress(employee.address);
    setEdit(true);
  };
  const editClose = () => {
    setEdit(false);
    setCurrentEmployee(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setAddress("");
  };
  const handleAlertClose = () => setAlertOpen(false);

  const handleCreate = async () => {
    if (!name || !phone || !email || !role || !address) {
      setAlertType("error");
      setAlertMessage("All fields are required");
      setAlertOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:4000/employee/create", {
        name,
        phone,
        email,
        role,
        address,
      });

      setAlertType("success");
      setAlertMessage("Employee created successfully");
      setAlertOpen(true);

      setTimeout(() => {
        handleClose();
        setName("");
        setEmail("");
        setPhone("");
        setRole("");
        setAddress("");
      }, 2000);

      fetchData();
    } catch (error) {
      console.error("Error creating employee:", error);
      setAlertType("error");
      setAlertMessage("Failed to create employee");
      setAlertOpen(true);
    }
  };

  const handleUpdate = async () => {
    if (!name || !phone || !email || !role || !address) {
      setAlertType("error");
      setAlertMessage("All fields are required");
      setAlertOpen(true);
      return;
    }

    console.log("Updating Employee with ID:", currentEmployee.id);
    console.log("Update Data:", {
      id: currentEmployee.id,
      name,
      phone,
      email,
      role,
      address,
    });

    try {
      await axios.post("http://localhost:4000/employee/update", {
        id: currentEmployee.id,
        name,
        phone,
        email,
        role,
        address,
      });

      setAlertType("success");
      setAlertMessage("Employee updated successfully");
      setAlertOpen(true);

      await fetchData();
      editClose();
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to update employee");
      setAlertOpen(true);
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/employee/delete/${id}`);
      setAlertType("success");
      setAlertMessage("Employee deleted successfully");
      setAlertOpen(true);

      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete employee");
      setAlertOpen(true);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/employee");
      console.log(response.data);
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  };

  return (
    <Container maxWidth="lg">
      <Grid container display={"flex"} flexDirection={"column"}>
        <Grid>
          <Typography>Manage Employee</Typography>
        </Grid>
        <Grid flexDirection={"row"} display={"flex"}>
          <Grid item md={6}>
            <Typography>{employee.length} Employees</Typography>
          </Grid>
          <Grid
            item
            md={6}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{ height: 40 }}
            >
              <PersonAddAltIcon marginRight={2} />
              Create Employee
            </Button>
          </Grid>
        </Grid>
        <Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.address}</TableCell>
                    <TableCell>
                      <Grid display={"flex"} flexDirection={"row"} gap={1}>
                        <Button
                          variant="outlined"
                          onClick={() => editOpen(emp)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(emp.id)}
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
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h2"
                align="center"
              >
                Create Employee
              </Typography>
            </Grid>
            <Grid item xs={4} display={"flex"} justifyContent={"end"}>
              <IconButton aria-label="delete" onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={4} marginTop={3}>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="Employee Name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="phone"
                label="Phone Number"
                variant="outlined"
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="role"
                label="Role"
                variant="outlined"
                fullWidth
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                fullWidth
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Modal
        open={edit}
        onClose={editClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h2"
                align="center"
              >
                Edit Employee
              </Typography>
            </Grid>
            <Grid item xs={4} display={"flex"} justifyContent={"end"}>
              <IconButton aria-label="delete" onClick={editClose}>
                <CloseOutlined />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={4} marginTop={3}>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="Employee Name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="phone"
                label="Phone Number"
                variant="outlined"
                fullWidth
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="role"
                label="Role"
                variant="outlined"
                fullWidth
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                fullWidth
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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

export default ManageEmployee;
