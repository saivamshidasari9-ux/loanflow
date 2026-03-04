// src/pages/AnalystDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "../components/AppHeader";
import {
  listLoans,
  approveLoan,
  rejectLoan,
  LoanApplication,
  LoanStatus,
  LOAN_STATUS_LABEL,
} from "../api/loans";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RadarIcon from '@mui/icons-material/Radar';

type StatusFilter = "ALL" | LoanStatus;

function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <Chip size="small" label="-" />;
  const label = LOAN_STATUS_LABEL[status] ?? status;

  let color = "var(--cyber-primary)";
  let borderColor = "rgba(6,182,212,0.3)";

  if (status === "APPROVED") {
    color = "var(--cyber-accent)";
    borderColor = "rgba(16, 185, 129, 0.3)";
  } else if (status === "REJECTED") {
    color = "var(--cyber-error)";
    borderColor = "rgba(244, 63, 94, 0.3)";
  }

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        border: `1px solid ${borderColor}`,
        backgroundColor: "rgba(3,7,18,0.5)",
        color,
        fontSize: "0.65rem",
        fontWeight: 900,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.1em"
      }}
    >
      {label}
    </Box>
  );
}

export default function AnalystDashboard() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [rows, setRows] = useState<LoanApplication[]>([]);

  const fetchLoans = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await listLoans({
        page: 0,
        size: 50,
        sortBy: "created_at",
        direction: "desc",
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setRows(res?.content ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "ERROR_CONNECTING_TO_DATA_NODE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const stats = useMemo(() => {
    return {
      submitted: rows.filter((r) => r.status === "SUBMITTED").length,
      approved: rows.filter((r) => r.status === "APPROVED").length,
      total: rows.length
    };
  }, [rows]);

  const onApprove = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await approveLoan(id);
      setSuccess(`LOAN_${id}_APPROVED`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.detail || `APPROVAL_FAILURE: LOAN_${id}`);
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await rejectLoan(id);
      setSuccess(`LOAN_${id}_REJECTED`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.detail || `REJECTION_FAILURE: LOAN_${id}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="ANALYST_DASHBOARD" />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-module"
            sx={{ p: { xs: 4, md: 6 }, mb: 4 }}
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
                    boxShadow: "0 0 15px var(--cyber-glow)"
                  }}
                >
                  <QueryStatsIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                    Risk Queue
                  </Typography>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                    {"// CHECKING_APPLICATIONS // SYSTEM_ACTIVE"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={6}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem", fontWeight: 900, mb: 1 }}>APPS_PENDING</Typography>
                  <Typography variant="h3" className="mono" sx={{ fontWeight: 900, color: "var(--cyber-primary)" }}>{stats.submitted}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem", fontWeight: 900, mb: 1 }}>TOTAL_APPS</Typography>
                  <Typography variant="h3" className="mono" sx={{ fontWeight: 900, color: "white" }}>{stats.total}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <AnimatePresence mode="wait">
            {error && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                sx={{ mb: 3, p: 2, border: "1px solid var(--cyber-error)", backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              >
                <Typography className="mono" sx={{ color: "var(--cyber-error)", fontSize: "0.8rem", fontWeight: 700 }}>
                  ALERT: {error}
                </Typography>
              </Box>
            )}
            {success && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                sx={{ mb: 3, p: 2, border: "1px solid var(--cyber-accent)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <Typography className="mono" sx={{ color: "var(--cyber-accent)", fontSize: "0.8rem", fontWeight: 700 }}>
                  SUCCESS: {success}
                </Typography>
              </Box>
            )}
          </AnimatePresence>

          <Box className="cyber-module" sx={{ p: 2, mb: 4, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
              <FormControl size="small" sx={{ minWidth: 300 }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="mono"
                  sx={{ color: "var(--cyber-primary)", fontSize: "0.8rem" }}
                >
                  <MenuItem value="ALL">{"[ ALL_HISTORY ]"}</MenuItem>
                  <MenuItem value="SUBMITTED">{"[ PENDING_VERIFICATION ]"}</MenuItem>
                  <MenuItem value="APPROVED">{"[ AUTHORIZED_LOGS ]"}</MenuItem>
                  <MenuItem value="REJECTED">{"[ REJECTED_LOGS ]"}</MenuItem>
                </Select>
              </FormControl>

              <Button
                onClick={fetchLoans}
                className="mono"
                startIcon={<RefreshIcon />}
                sx={{
                  color: "var(--cyber-primary)",
                  fontSize: "0.8rem",
                  "&:hover": { backgroundColor: "rgba(6,182,212,0.1)" }
                }}
              >
                REFRESH_DATA
              </Button>
            </Stack>
          </Box>

          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ py: 15, textAlign: "center" }}>
                <CircularProgress size={48} sx={{ color: "var(--cyber-primary)", mb: 3 }} />
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>
                  LOADING_DATA...
                </Typography>
              </Box>
            ) : rows.length === 0 ? (
              <Box className="cyber-module" sx={{ p: 10, textAlign: "center" }}>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {"// NO_PENDING_LOANS_FOUND"}
                </Typography>
              </Box>
            ) : (
              <AnimatePresence>
                {rows.map((row, idx) => (
                  <Box
                    key={row.id}
                    component={motion.div}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="cyber-module"
                    sx={{
                      p: 4,
                      "&:hover": { borderColor: "var(--cyber-primary)" }
                    }}
                  >
                    <Grid container spacing={4} alignItems="center">
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Stack direction="row" spacing={3} alignItems="center" mb={2}>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>
                            {row.full_name?.toUpperCase()}
                          </Typography>
                          <StatusChip status={row.status} />
                          <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
                            LOAN_ID: {row.id}
                          </Typography>
                        </Stack>

                        <Grid container spacing={2}>
                          {[
                            { l: "LOAN_AMOUNT", v: `$${row.amount?.toLocaleString()}` },
                            { l: "RISK_RATING", v: `${row.risk_score || 0}/100`, c: (row.risk_score ?? 0) > 70 ? "var(--cyber-error)" : "var(--cyber-accent)" },
                            { l: "INTEREST_RATE", v: `${row.interest_rate}%` },
                            { l: "DECISION", v: row.eligibility_decision || "PROCESSING..." }
                          ].map((field, i) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={i}>
                              <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.55rem", mb: 0.5 }}>{field.l}</Typography>
                              <Typography className="mono" sx={{ color: field.c || "white", fontWeight: 900, fontSize: "0.9rem" }}>{field.v}</Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                          <Button
                            variant="contained"
                            disabled={busyId !== null || row.status !== "SUBMITTED"}
                            onClick={() => onApprove(row.id)}
                            sx={{
                              backgroundColor: "var(--cyber-accent)",
                              color: "black",
                              fontWeight: 900,
                              fontSize: "0.7rem",
                              px: 4,
                              "&:hover": { backgroundColor: "white" }
                            }}
                          >
                            [ APPROVE ]
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={busyId !== null || row.status !== "SUBMITTED"}
                            onClick={() => onReject(row.id)}
                            sx={{
                              borderColor: "var(--cyber-error)",
                              color: "var(--cyber-error)",
                              fontWeight: 900,
                              fontSize: "0.7rem",
                              px: 4,
                              "&:hover": { borderColor: "white", color: "white" }
                            }}
                          >
                            [ REJECT ]
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </AnimatePresence>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
