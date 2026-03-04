import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../api/auth";
import AppHeader from "../components/AppHeader";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

export default function SignupPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1, x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const submit = async () => {
    setError(null);
    setOk(null);

    if (!username || !password) {
      setError("PLEASE_FILL_ALL_FIELDS");
      return;
    }
    if (password !== confirm) {
      setError("PASSWORDS_DO_NOT_MATCH");
      return;
    }

    try {
      await register({ username, password });
      setOk("ACCOUNT_CREATED. REDIRECTING...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "SIGNUP_FAILED: USERNAME_TAKEN");
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader />

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 8, px: 2 }}>
        <Container maxWidth="xs">
          <Box
            component={motion.div}
            {...{ variants: containerVariants } as any}
            initial="hidden"
            animate="visible"
            className="cyber-module"
            sx={{
              p: { xs: 4, sm: 6 },
              width: "100%",
            }}
          >
            <Stack spacing={4} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  border: "2px solid var(--cyber-secondary)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--cyber-secondary)",
                  boxShadow: "0 0 15px rgba(139, 92, 246, 0.1)"
                }}
              >
                <PersonAddOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" className="mono" sx={{ fontWeight: 900, color: "white", mb: 1, letterSpacing: "0.1em" }}>
                  SIGN UP
                </Typography>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  {"// JOIN_LOANFLOW_BANK"}
                </Typography>
              </Box>

              {error && (
                <Box sx={{ width: "100%", p: 2, border: "1px solid var(--cyber-error)", backgroundColor: "rgba(244, 63, 94, 0.1)" }}>
                  <Typography className="mono" sx={{ color: "var(--cyber-error)", fontSize: "0.75rem", fontWeight: 700 }}>
                    {error}
                  </Typography>
                </Box>
              )}
              {ok && (
                <Box sx={{ width: "100%", p: 2, border: "1px solid var(--cyber-accent)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                  <Typography className="mono" sx={{ color: "var(--cyber-accent)", fontSize: "0.75rem", fontWeight: 700 }}>
                    {ok}
                  </Typography>
                </Box>
              )}

              <Stack spacing={3} sx={{ width: "100%" }}>
                <TextField
                  label="USERNAME"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mono"
                />

                <TextField
                  label="PASSWORD"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "var(--cyber-primary)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="CONFIRM PASSWORD"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submit}
                  sx={{
                    py: 2,
                    mt: 2,
                    backgroundColor: "#fbbf24",
                    color: "black",
                    fontWeight: 900,
                    "&:hover": {
                      backgroundColor: "white",
                    }
                  }}
                >
                  CREATE ACCOUNT
                </Button>

                <Box sx={{ pt: 2, textAlign: "center" }}>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                    ALREADY HAVE AN ACCOUNT?{" "}
                    <Typography
                      component={RouterLink}
                      to="/login"
                      className="mono"
                      sx={{
                        color: "#fbbf24",
                        fontWeight: 900,
                        textDecoration: "none",
                        fontSize: "0.7rem",
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      [ LOGIN ]
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
