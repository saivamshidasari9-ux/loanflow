import React from "react";
import { AppBar, Toolbar, Box, Button, Typography, Container, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AppHeaderProps {
  showCreateAccount?: boolean;
  showLogout?: boolean;
  pageTitle?: string;
}

export default function AppHeader({
  showCreateAccount = false,
  showLogout = false,
  pageTitle = "",
}: AppHeaderProps) {
  const nav = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "transparent",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 0, md: 0 } }}>
        <Toolbar
          className="cyber-module"
          sx={{
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            px: { xs: 2, md: 6 },
            height: 64,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* System ID / Brand */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            onClick={() => nav("/")}
            sx={{ cursor: "pointer" }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid var(--cyber-primary)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--cyber-primary)",
                  fontWeight: 900,
                  fontSize: "1rem",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {"//"}
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              className="mono"
              sx={{
                fontWeight: 900,
                letterSpacing: "0.2em",
                color: "var(--cyber-primary)",
                fontSize: "1.1rem",
                textTransform: "uppercase",
              }}
            >
              LOANFLOW
            </Typography>
          </Stack>

          {/* Tactical Telemetry / Page Title */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--cyber-accent)",
                boxShadow: "0 0 10px var(--cyber-accent)",
              }}
            />
            <Typography
              className="mono"
              sx={{
                fontWeight: 700,
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
              }}
            >
              {pageTitle || "READY"}
            </Typography>
          </Box>

          {/* Terminal Actions */}
          <Stack direction="row" spacing={3} alignItems="center">
            {showCreateAccount && (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "var(--text-muted)",
                    fontSize: "0.7rem",
                    "&:hover": { color: "var(--cyber-primary)" }
                  }}
                >
                  [ LOGIN ]
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--cyber-primary)",
                    color: "black",
                    fontSize: "0.7rem",
                    px: 3,
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  SIGN UP
                </Button>
              </>
            )}

            {showLogout && (
              <Button
                onClick={() => {
                  localStorage.clear();
                  nav("/");
                }}
                sx={{
                  color: "var(--cyber-error)",
                  fontSize: "0.7rem",
                  "&:hover": { background: "rgba(244, 63, 94, 0.1)" }
                }}
              >
                [ LOGOUT ]
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
