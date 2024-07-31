import React, { useState, useEffect } from "react";
import { Container, Grid, Box, Button } from "@mui/material";
import ManageEmployee from "../components/ManageEmployee";
import ManageTask from "../components/ManageTask";
import Message from "../components/Message";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

function Dashboard() {
  const history = useNavigate();
  const [selectKey, setSelectKey] = useState("1");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log(role);
    if (!role) {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log(decoded.role);
          setUserRole(decoded.role);
          setSelectKey("2");
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          history("/login");
        }
      } else {
        history("/login");
      }
    } else {
      setUserRole(role);
    }
  }, []);
  console.log(userRole);
  const handleMenuClick = (num) => {
    setSelectKey(num);
  };

  const selectedStyle = {
    height: 40,
    borderRight: "#3333FF solid 4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    color: "#0099FF",
    fontWeight: 700,
    backgroundColor: "#CCFFFF",
  };
  const unSelectedStyle = {
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    history("/login");
  };
  return (
    <Container maxWidth="lg">
      <Grid container justifyContent={"flex-end"}>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ fontWeight: 800 }}
        >
          <LogoutIcon></LogoutIcon>
          Logout
        </Button>
      </Grid>
      <Grid container>
        <Grid item md={3} space={2}>
          {userRole === "admin" && (
            <>
              <Box
                sx={selectKey === "1" ? selectedStyle : unSelectedStyle}
                onClick={() => handleMenuClick("1")}
              >
                Manage Employee
              </Box>
            </>
          )}
          <Box
            sx={selectKey === "2" ? selectedStyle : unSelectedStyle}
            onClick={() => handleMenuClick("2")}
          >
            Manage Task
          </Box>

          <Box
            sx={selectKey === "3" ? selectedStyle : unSelectedStyle}
            onClick={() => handleMenuClick("3")}
          >
            Chat
          </Box>
        </Grid>
        <Grid item md={8} space={2}>
          {selectKey === "1" && userRole === "admin" && <ManageEmployee />}
          {selectKey === "2" && <ManageTask />}
          {selectKey === "3" && <Message />}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
