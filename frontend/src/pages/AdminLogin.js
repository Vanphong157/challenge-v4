import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import firebase from "../firebaseconfig";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        defaultCountry: "VN",
      }
    );
  };

  const sendOtp = async () => {
    const appVerify = window.recaptchaVerifier;
    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerify);
      window.confirmationResult = confirmationResult;
      setStep("otp");
      alert("OTP sent");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      localStorage.setItem("role", "admin");
      alert("Verification successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Verification failed");
    }
  };

  useEffect(() => {
    setupRecaptcha();
  }, []);

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
              onClick={() => setStep("phone")}
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
            {step === "phone" ? (
              <>
                <Typography>Please enter your phone number</Typography>
                <Box marginBottom={3} marginTop={3}>
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    variant="outlined"
                    placeholder="+84......"
                    sx={{ width: 250 }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                  onClick={sendOtp}
                >
                  NEXT
                </Button>
              </>
            ) : (
              <>
                <Typography>Please enter the OTP sent to your phone</Typography>
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
                  onClick={verifyOtp}
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
};
