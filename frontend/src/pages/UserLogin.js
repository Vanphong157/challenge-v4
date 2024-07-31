import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [step, setStep] = useState("email");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/employee/login",
        {
          email,
        }
      );
      setAlertType("success");
      setAlertMessage(response.data.msg);
      setIsOtpSent(true);
      setStep("otp");
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response.data.error);
    }
    setAlertOpen(true);
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/verify-otp", {
        email,
        otp,
      });
      setAlertType("success");
      setAlertMessage(response.data.msg);
      console.log(response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      setAlertType("error");
    }
    setAlertOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        flexDirection={"column"}
        justifyContent={"center"}
        alignContent={"center"}
        height={500}
        padding={20}
      >
        <Grid sx={{ border: "grey solid 1px", padding: 5 }}>
          <Box display={"flex"} alignItems={"center"} marginBottom={3}>
            <ArrowBackIcon
              sx={{ fontSize: 20, fontWeight: 700 }}
              onClick={() => setStep("email")}
            />
            <Typography sx={{ fontSize: 20, fontWeight: 700, marginLeft: 1 }}>
              Back
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Sign In
            </Typography>
          </Box>
          <Box marginBottom={3}>
            {step === "email" ? (
              <>
                <Typography>Please enter your email</Typography>
                <Box marginBottom={3} marginTop={3}>
                  <TextField
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    placeholder="Email"
                    sx={{ width: 250 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                      background: "#90BAE0",
                    },
                  }}
                  onClick={handleLogin}
                >
                  NEXT
                </Button>
              </>
            ) : (
              <>
                <Typography>Please enter the OTP sent to your email</Typography>
                <Box marginBottom={3}>
                  <TextField
                    id="outlined-basic"
                    label="OTP"
                    variant="outlined"
                    placeholder="Your OTP"
                    sx={{ width: 250 }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                      background: "#90BAE0",
                    },
                  }}
                  onClick={handleVerifyOtp}
                >
                  VERIFY
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <div id="sign-in-button"></div>
    </Container>
  );
}

export default UserLogin;
