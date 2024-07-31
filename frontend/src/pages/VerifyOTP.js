import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { hover } from "@testing-library/user-event/dist/hover";
import { red } from "@mui/material/colors";

export const AdminLogin = () => {
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
            ></ArrowBackIcon>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Back</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Sign In
            </Typography>
          </Box>
          <Box marginBottom={3}>
            <Typography>Please enter your phone number</Typography>
          </Box>
          <Box marginBottom={3}>
            <TextField
              id="outlined-basic"
              label="Num"
              variant="outlined"
              placeholder="Your phone number"
              sx={{
                width: 250,
              }}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                ":hover": {
                  cursor: "pointer",
                  background: "#90BAE0",
                },
              }}
            >
              NEXT
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
