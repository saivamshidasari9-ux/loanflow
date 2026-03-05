import React from "react";
import { Box, Container, Typography, Button, Stack, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { motion } from "framer-motion";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import HubIcon from '@mui/icons-material/Hub';
import MemoryIcon from '@mui/icons-material/Memory';
import RadarIcon from '@mui/icons-material/Radar';

export default function HomePage() {
  const nav = useNavigate();
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const modules = [
    {
      icon: <MemoryIcon sx={{ fontSize: 32 }} />,
      label: "CORE_PROCESSOR",
      title: "Real-time Intelligence",
      desc: "Distributed ledger analysis with 0.4ms latency for instant capital authorization."
    },
    {
      icon: <RadarIcon sx={{ fontSize: 32 }} />,
      label: "RISK_TELEMETRY",
      title: "Tactical Monitoring",
      desc: "Live risk assessment streaming directly through our encrypted governance pipeline."
    },
    {
      icon: <HubIcon sx={{ fontSize: 32 }} />,
      label: "CAPITAL_NETWORK",
      title: "Seamless Liquidity",
      desc: "Instant node connectivity for institutional-grade asset mobilization across the grid."
    }
  ];

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <AppHeader showCreateAccount />

      <Container maxWidth="xl">
        <Box
          component={motion.div}
          {...{ variants: containerVariants } as any}
          initial="hidden"
          animate="visible"
          sx={{ pt: { xs: 15, md: 20 }, pb: 10 }}
        >
          <Grid container spacing={8} alignItems="center">
            {/* Hero Tactical HUD */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box component={motion.div} {...{ variants: itemVariants } as any}>
                <Stack spacing={4}>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1, backgroundColor: "rgba(6,182,212,0.1)", border: "1px solid var(--cyber-border)" }}>
                        <Typography className="mono" sx={{ fontSize: "0.7rem", color: "var(--cyber-primary)", fontWeight: 900 }}>v4.0.2_STABLE</Typography>
                      </Box>
                      <Typography className="mono" sx={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.2em" }}>SYSTEM_INITIALIZED // NODE_01</Typography>
                    </Stack>

                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: "3rem", md: "5.5rem" },
                        lineHeight: 0.9,
                        mb: 4,
                        color: "white",
                        fontStyle: "italic", // Tactical aggressive look
                      }}
                    >
                      SMART LOANS FOR <br />
                      <span className="text-cyber" style={{ color: "#fbbf24" }}>YOUR FUTURE.</span>
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        lineHeight: 1.6,
                        maxWidth: 600,
                        borderLeft: "2px solid #fbbf24",
                        pl: 4,
                        fontSize: { xs: "1rem", md: "1.25rem" }
                      }}
                    >
                      Simple and secure loans for the next generation.
                      Get the money you need through our fast and easy command interface.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ pt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => nav("/login")}
                      sx={{
                        px: 6,
                        py: 2.5,
                        fontSize: "0.9rem",
                        backgroundColor: "#fbbf24",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "white",
                        }
                      }}
                    >
                      LOGIN
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => nav("/signup")}
                      sx={{
                        px: 6,
                        py: 2.5,
                        fontSize: "0.9rem",
                        borderColor: "#fbbf24",
                        color: "white",
                        "&:hover": {
                          borderColor: "white",
                          background: "rgba(251,191,36,0.05)"
                        }
                      }}
                    >
                      APPLY NOW
                    </Button>
                  </Stack>
                  <Box sx={{ mt: 3, opacity: 0.8 }}>
                    <Typography
                      component={RouterLink}
                      to="/login"
                      className="mono"
                      sx={{
                        color: "var(--cyber-primary)",
                        fontSize: "0.75rem",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline", color: "white", opacity: 1 }
                      }}
                    >
                      [ DEMO_ACCESS_AVAILABLE → ]
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Tactical Visualization */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box component={motion.div} {...{ variants: itemVariants } as any} className="cyber-module" sx={{ p: 4, position: "relative" }}>
                <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.8rem", fontWeight: 900 }}>REAL_TIME_ORCHESTRATION</Typography>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                    <HubIcon sx={{ color: "var(--cyber-primary)", opacity: 0.5 }} />
                  </motion.div>
                </Box>

                <Stack spacing={3}>
                  {[
                    { label: "NETWORK_LOAD", value: "0.042ms", color: "var(--cyber-accent)" },
                    { label: "ASSET_VOLATILITY", value: "STABLE", color: "white" },
                    { label: "ENCRYPT_PROTOCOL", value: "AES_256", color: "var(--cyber-secondary)" }
                  ].map((stat, i) => (
                    <Box key={i} sx={{ p: 2, border: "1px solid rgba(6,182,212,0.1)", backgroundColor: "rgba(3,7,18,0.5)" }}>
                      <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem", mb: 0.5 }}>{stat.label}</Typography>
                      <Typography className="mono" sx={{ color: stat.color, fontWeight: 900, fontSize: "1.2rem" }}>{stat.value}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid var(--cyber-border)" }}>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.65rem", lineHeight: 1.8 }}>
                    // LOG_ENTRY: 0xa4f2c9... <br />
                    // SYSTEM_STATUS: ALL_SYSTEMS_GO <br />
                    // ENCRYPTION_SECURED
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Core Modules Grid */}
          <Grid container spacing={4} sx={{ mt: 10 }}>
            {modules.map((m, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box
                  component={motion.div}
                  {...{ variants: itemVariants } as any}
                  whileHover={{ scale: 1.02 }}
                  className="cyber-module"
                  sx={{
                    p: 5,
                    height: "100%",
                  }}
                >
                  <Box sx={{ mb: 4, color: "var(--cyber-primary)" }}>
                    {m.icon}
                  </Box>
                  <Typography className="mono" sx={{ fontSize: "0.7rem", color: "var(--cyber-primary)", mb: 1, letterSpacing: "0.2em", fontWeight: 900 }}>{m.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: "white" }}>
                    {m.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-muted)", lineHeight: 1.8, fontWeight: 500 }}>
                    {m.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
