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
import { login } from "../api/auth";
import { setAuth } from "../auth/authStorage";
import AppHeader from "../components/AppHeader";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const submit = async () => {
    setError(null);
    try {
      const data = await login({ username, password });
      setAuth(data.token, data.role, data.username);

      if (data.role === "ADMIN") nav("/admin");
      else if (data.role === "ANALYST") nav("/analyst");
      else nav("/customer");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "ACCESS_DENIED: INVALID_CREDENTIALS");
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
                  border: "2px solid var(--cyber-primary)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--cyber-primary)",
                  boxShadow: "0 0 15px var(--cyber-glow)"
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" className="mono" sx={{ fontWeight: 900, color: "white", mb: 1, letterSpacing: "0.1em" }}>
                  LOGIN
                </Typography>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  {"// SECURE_CONNECTION_ACTIVE"}
                </Typography>
              </Box>

              {error && (
                <Box sx={{ width: "100%", p: 2, border: "1px solid var(--cyber-error)", backgroundColor: "rgba(244, 63, 94, 0.1)" }}>
                  <Typography className="mono" sx={{ color: "var(--cyber-error)", fontSize: "0.75rem", fontWeight: 700 }}>
                    {error}
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
                  onKeyDown={(e) => e.key === "Enter" && submit()}
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
                    "&:hover": { backgroundColor: "white" }
                  }}
                >
                  LOG IN
                </Button>

                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                  NO ACCOUNT?{" "}
                  <Typography
                    component={RouterLink}
                    to="/signup"
                    className="mono"
                    sx={{
                      color: "#fbbf24",
                      fontWeight: 900,
                      textDecoration: "none",
                      fontSize: "0.7rem",
                      "&:hover": { textDecoration: "underline" }
                    }}
                  >
                    [ CREATE_ACCOUNT ]
                  </Typography>
                </Typography>
              </Box>

              {/* --- DEMO ACCOUNTS BOX --- */}
              <Box
                sx={{
                  mt: 4,
                  p: 2.5,
                  border: "1px dashed rgba(6,182,212,0.3)",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0,0,0,0.2)"
                }}
              >
                <Typography className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.75rem", fontWeight: 700, mb: 1.5, letterSpacing: "1px" }}>
                    // DEMO_ACCESS_CREDENTIALS
                </Typography>
                {[
                  { role: "ADMIN_PORTAL", creds: "admin / admin123" },
                  { role: "ANALYST_NODE", creds: "analyst / analyst123" },
                  { role: "CLIENT_HUD", creds: "customer / customer123" }
                ].map((demo, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, pb: 1, borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem", opacity: 0.8 }}>
                      {demo.role}
                    </Typography>
                    <Typography className="mono" sx={{ color: "#fbbf24", fontSize: "0.75rem", fontWeight: 700 }}>
                      {demo.creds}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Stack>
          </Stack>
      </Box>
    </Container>
      </Box >
    </Box >
  );
}
