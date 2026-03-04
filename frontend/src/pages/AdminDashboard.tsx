// src/pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SpeedIcon from '@mui/icons-material/Speed';
import HubIcon from '@mui/icons-material/Hub';
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { getAdminMetrics, AdminMetrics } from "../api/admin";

type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
  progress?: number;
  loading?: boolean;
};

function MetricCard({ title, value, subtitle, icon, accent, onClick, progress, loading }: MetricCardProps) {
  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cyber-module"
      sx={{
        p: 4,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box
          sx={{
            width: 48,
            height: 48,
            border: `1px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            color: accent,
            boxShadow: `0 0 10px ${accent}20`
          }}
        >
          {icon}
        </Box>
        <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>REAL_TIME_FEED</Typography>
      </Stack>

      <Typography variant="h3" className="mono" sx={{ fontWeight: 900, mb: 0.5, color: "white" }}>
        {loading ? "---" : value}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "white", mb: 0.5 }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: "var(--text-muted)", fontWeight: 500 }}>{subtitle}</Typography>

      {typeof progress === "number" && (
        <Box sx={{ mt: 4 }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography className="mono" sx={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>ACTIVITY_LEVEL</Typography>
            <Typography className="mono" sx={{ fontSize: "0.55rem", color: accent }}>{Math.round(progress)}%</Typography>
          </Stack>
          <Box sx={{ height: 2, backgroundColor: "rgba(255,255,255,0.05)", position: "relative" }}>
            <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const m = await getAdminMetrics();
        setMetrics(m);
      } catch (err) {
        console.error("METRIC_SYNC_FAILURE", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalUsers = useMemo(() => {
    return (metrics?.customers ?? 0) + (metrics?.analysts ?? 0) + (metrics?.admins ?? 0);
  }, [metrics]);

  const pct = (val: number) => (totalUsers ? (val / totalUsers) * 100 : 0);

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="ADMIN_DASHBOARD" />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-module"
            sx={{ p: { xs: 4, md: 6 }, mb: 4, borderLeft: "4px solid var(--cyber-primary)" }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    border: "2px solid var(--cyber-primary)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--cyber-primary)",
                  }}
                >
                  <AdminPanelSettingsRoundedIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                    All Loans
                  </Typography>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {"// SYSTEM_OVERVIEW // LOAN_TRACKING: [ACTIVE]"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={3}>
                <Button
                  onClick={() => nav("/admin/users")}
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.5,
                    backgroundColor: "var(--cyber-primary)",
                    color: "black",
                    fontWeight: 900,
                    fontSize: "0.8rem"
                  }}
                >
                  MANAGE_USERS
                </Button>
                <Button
                  onClick={() => nav("/admin/loans")}
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: "var(--cyber-border)",
                    color: "white",
                    fontWeight: 900,
                    fontSize: "0.8rem"
                  }}
                >
                  VIEW_LOANS
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Active Customers"
                value={metrics?.customers ?? 0}
                subtitle="Approved customers"
                icon={<PeopleAltRoundedIcon />}
                accent="var(--cyber-primary)"
                onClick={() => nav("/admin/users?role=CUSTOMER")}
                progress={pct(metrics?.customers ?? 0)}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Verification Analysts"
                value={metrics?.analysts ?? 0}
                subtitle="Review experts"
                icon={<ManageAccountsRoundedIcon />}
                accent="var(--cyber-secondary)"
                onClick={() => nav("/admin/users?role=ANALYST")}
                progress={pct(metrics?.analysts ?? 0)}
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Operational Volume"
                value={metrics?.loans ?? 0}
                subtitle="All completed applications"
                icon={<RequestQuoteRoundedIcon />}
                accent="var(--cyber-accent)"
                onClick={() => nav("/admin/loans")}
                loading={loading}
              />
            </Grid>
          </Grid>

          <Box className="cyber-module" sx={{ p: { xs: 4, md: 6 } }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={6}>
              <Box sx={{ color: "var(--cyber-accent)" }}>
                <SpeedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>
                System Health
              </Typography>
            </Stack>

            <Grid container spacing={6}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={4}>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>CONNECTION_SPEED</Typography>
                    <Typography className="mono" sx={{ color: "var(--cyber-accent)", fontSize: "0.65rem" }}>0.024ms</Typography>
                  </Stack>
                  <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <Box sx={{ height: "100%", width: "100%", backgroundColor: "var(--cyber-accent)", boxShadow: "0 0 10px var(--cyber-accent)" }} />
                  </Box>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>SYSTEM_LOAD</Typography>
                    <Typography className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.65rem" }}>STABLE</Typography>
                  </Stack>
                  <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <Box sx={{ height: "100%", width: "100%", backgroundColor: "var(--cyber-primary)", boxShadow: "0 0 10px var(--cyber-primary)" }} />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={4}>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>DATA_SYNC_INDEX</Typography>
                    <Typography className="mono" sx={{ color: "white", fontSize: "0.65rem" }}>100%</Typography>
                  </Stack>
                  <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <Box sx={{ height: "100%", width: "100%", backgroundColor: "white" }} />
                  </Box>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>SECURITY_STATUS</Typography>
                    <Typography className="mono" sx={{ color: "var(--cyber-accent)", fontSize: "0.65rem" }}>ACTIVE</Typography>
                  </Stack>
                  <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <Box sx={{ height: "100%", width: "100%", backgroundColor: "var(--cyber-accent)", boxShadow: "0 0 10px var(--cyber-accent)" }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
