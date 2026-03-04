import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "../components/AppHeader";
import { getAuth } from "../auth/authStorage";
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RadarIcon from '@mui/icons-material/Radar';
import HubIcon from '@mui/icons-material/Hub';

export default function CustomerDashboard() {
  const nav = useNavigate();
  const { username } = getAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="TACTICAL_COMMAND" />

      <Box sx={{ py: { xs: 12, md: 16 }, flex: 1 }}>
        <Container maxWidth="xl">
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{ mb: 8, borderLeft: "4px solid var(--cyber-primary)", pl: 4 }}
          >
            <Typography className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.8rem", letterSpacing: "0.2em", mb: 1, fontWeight: 900 }}>
              OPERATIVE_PROFILE: {username?.toUpperCase() || "ACCESS_GUEST"}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, color: "white", mb: 1 }}>
              Command Center
            </Typography>
            <Typography variant="h6" className="mono" sx={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              {"// LOAN_STATUS: [ ACTIVE ] // ACCOUNT_LEVEL: [ GOLD ]"}
            </Typography>
          </Box>

          <Box
            component={motion.div}
            {...{ variants: containerVariants } as any}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              {/* Primary Action: New Protocol */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Box
                  component={motion.div}
                  {...{ variants: itemVariants } as any}
                  className="cyber-module"
                  sx={{
                    p: 6,
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": { borderColor: "var(--cyber-glow)" }
                  }}
                  onClick={() => nav("/loan-application")}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 6 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        border: "2px solid var(--cyber-primary)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--cyber-primary)",
                        boxShadow: "0 0 20px var(--cyber-glow)"
                      }}
                    >
                      <AddIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.7rem", fontWeight: 900 }}>INITIALIZE_NEW_ID_SEQUENCE</Typography>
                  </Box>

                  <Box sx={{ maxWidth: 500 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: "white" }}>
                      New Loan
                    </Typography>
                    <Typography variant="body1" sx={{ color: "var(--text-muted)", mb: 4, lineHeight: 1.8, fontSize: "1.1rem" }}>
                      Apply for a new loan in minutes. Our smart system
                      checks your application in real-time.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "var(--cyber-primary)" }}>
                    <Typography className="mono" sx={{ fontWeight: 900, letterSpacing: "0.1em" }}>[ ACCESS_TERMINAL ]</Typography>
                    <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                  </Stack>

                  {/* Aesthetic Background Radar */}
                  <Box sx={{ position: "absolute", bottom: -40, right: -40, opacity: 0.05 }}>
                    <RadarIcon sx={{ fontSize: 300, color: "var(--cyber-primary)" }} />
                  </Box>
                </Box>
              </Grid>

              {/* Sidebar Modules */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Stack spacing={4} sx={{ height: "100%" }}>
                  <Box
                    component={motion.div}
                    {...{ variants: itemVariants } as any}
                    className="cyber-module"
                    sx={{
                      p: 4,
                      flex: 1,
                      cursor: "pointer",
                      "&:hover": { borderColor: "var(--cyber-secondary)" }
                    }}
                    onClick={() => nav("/application-status")}
                  >
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                      <Box sx={{ color: "var(--cyber-secondary)" }}>
                        <ListAltIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>System Logs</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                      View your loan history and real-time updates.
                    </Typography>
                  </Box>

                  <Box
                    component={motion.div}
                    {...{ variants: itemVariants } as any}
                    className="cyber-module"
                    sx={{
                      p: 4,
                      flex: 1,
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--cyber-accent)", mb: 1, fontWeight: 900 }}>SYSTEM_HEALTH: OPTIMAL</Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <Box key={i} sx={{ height: 16, width: 4, backgroundColor: i < 6 ? "var(--cyber-accent)" : "rgba(255,255,255,0.1)" }} />
                      ))}
                    </Box>
                    <Typography className="mono" sx={{ fontSize: "0.65rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {"// NODE_SYNC: COMPLETE"} <br />
                      {"// LATENCY: 0.042ms"} <br />
                      {"// UPTIME: 99.99%"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Bottom Real-time Feed */}
              <Grid size={{ xs: 12 }}>
                <Box
                  component={motion.div}
                  {...{ variants: itemVariants } as any}
                  className="cyber-module"
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    border: "1px solid rgba(6,182,212,0.1)"
                  }}
                >
                  <Box
                    component={motion.div}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "var(--cyber-accent)", boxShadow: "0 0 10px var(--cyber-accent)" }}
                  />
                  <Typography className="mono" sx={{ color: "white", fontSize: "0.8rem", fontWeight: 700 }}>
                    STREAM_SYNC: <span className="text-cyber">CONNECTED</span> — ANALYST_NODES_ACTIVE — CAPITAL_RESERVE: [SECURED]
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem", display: { xs: "none", md: "block" } }}>
                    SESSION_TOKEN: 0XF4..2A9C
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
