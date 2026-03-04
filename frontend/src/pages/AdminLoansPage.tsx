// src/pages/AdminLoansPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
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
import RefreshIcon from '@mui/icons-material/Refresh';

type StatusFilter = "ALL" | LoanStatus;

function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <span className="mono" style={{ color: "var(--text-muted)" }}>---</span>;
  const label = LOAN_STATUS_LABEL[status] ?? status;
  const color = status === "APPROVED" ? "var(--cyber-accent)" : status === "REJECTED" ? "var(--cyber-error)" : "var(--cyber-primary)";

  return (
    <Box
      sx={{
        px: 1,
        py: 0.2,
        border: `1px solid ${color}`,
        color,
        fontSize: "0.6rem",
        fontWeight: 900,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase"
      }}
    >
      {label}
    </Box>
  );
}

export default function AdminLoansPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [rows, setRows] = useState<LoanApplication[]>([]);

  const fetchLoans = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await listLoans({
        page: 0,
        size: 100,
        sortBy: "created_at",
        direction: "desc",
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setRows(res?.content ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "LEDGER_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const onApprove = async (id: number) => {
    setBusyId(id);
    try {
      await approveLoan(id);
      setSuccess(`PROTOCOL_${id}_AUTHORIZED`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.detail || `AUTHORIZATION_FAILURE_${id}`);
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (id: number) => {
    setBusyId(id);
    try {
      await rejectLoan(id);
      setSuccess(`PROTOCOL_${id}_TERMINATED`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.detail || `TERMINATION_FAILURE_${id}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="ADMIN_LOANS" />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box className="cyber-module" sx={{ p: { xs: 4, md: 6 }, mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "white", mb: 1 }}>
              System Review
            </Typography>
            <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              {"// LOAN_RECORDS // DATA_SYNC: [PASSED]"}
            </Typography>
          </Box>

          <Box className="cyber-module" sx={{ p: 2, mb: 4, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
              <FormControl size="small" sx={{ minWidth: 300 }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="mono"
                  sx={{ color: "var(--cyber-primary)", fontSize: "0.8rem" }}
                >
                  <MenuItem value="ALL">[ ALL_LOANS ]</MenuItem>
                  <MenuItem value="SUBMITTED">[ PENDING_REVIEW ]</MenuItem>
                  <MenuItem value="APPROVED">[ APPROVED_APPS ]</MenuItem>
                  <MenuItem value="REJECTED">[ REJECTED_APPS ]</MenuItem>
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
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  REFRESHING_DATA...
                </Typography>
              </Box>
            ) : rows.length === 0 ? (
              <Box className="cyber-module" sx={{ p: 10, textAlign: "center" }}>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  // REGISTRY_FINALIZED // NO_RECORDS_MATCH
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
                    transition={{ delay: idx * 0.03 }}
                    className="cyber-module"
                    sx={{ p: 4, "&:hover": { borderColor: "var(--cyber-primary)" } }}
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
                            { l: "TERM", v: `${row.tenure} MO` },
                            { l: "USERNAME", v: row.username?.toUpperCase() || "SYSTEM" },
                            { l: "DECISION", v: row.eligibility_decision || "PROCESSING..." }
                          ].map((field, i) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={i}>
                              <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.55rem", mb: 0.5 }}>{field.l}</Typography>
                              <Typography className="mono" sx={{ color: "white", fontWeight: 900, fontSize: "0.85rem" }}>{field.v}</Typography>
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
                              p: 1.5,
                              backgroundColor: "var(--cyber-primary)",
                              color: "black",
                              fontWeight: 900,
                              fontSize: "0.6rem"
                            }}
                          >
                            [ APPROVE ]
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={busyId !== null || row.status !== "SUBMITTED"}
                            onClick={() => onReject(row.id)}
                            sx={{
                              p: 1.5,
                              borderColor: "var(--cyber-error)",
                              color: "var(--cyber-error)",
                              fontWeight: 900,
                              fontSize: "0.6rem"
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
