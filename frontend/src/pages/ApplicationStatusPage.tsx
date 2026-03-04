// src/pages/ApplicationStatusPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TableContainer,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "../components/AppHeader";
import client from "../api/client";
import { LoanApplication, LoanStatus, LOAN_STATUS_LABEL } from "../api/loans";
import FilterListIcon from '@mui/icons-material/FilterList';

function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <span className="mono" style={{ color: "var(--text-muted)" }}>---</span>;
  const label = LOAN_STATUS_LABEL[status];
  const color = status === "APPROVED" ? "var(--cyber-accent)" : status === "REJECTED" ? "var(--cyber-error)" : "var(--cyber-primary)";

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.2,
        border: `1px solid ${color}`,
        color,
        fontSize: "0.6rem",
        fontWeight: 900,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {label}
    </Box>
  );
}

export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<LoanStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<LoanApplication[]>([]);
  const [error, setError] = useState<string>("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", "0");
    params.set("size", "50");
    params.set("sortBy", "created_at");
    params.set("direction", "desc");
    if (status !== "ALL") params.set("status", status);
    return `/api/loans?${params.toString()}`;
  }, [status]);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await client.get(query);
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setRows(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "LEDGER_RETRIEVAL_FAILURE");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query]);

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="UNIFIED_PORTFOLIO_LEDGER" />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box className="cyber-module" sx={{ p: { xs: 4, md: 6 }, mb: 4, borderLeft: "4px solid var(--cyber-primary)" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                  My Loans
                </Typography>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  {"// LOAN_TRACKING // SYSTEM_CHECK: [PASSED]"}
                </Typography>
              </Box>

              <FormControl size="small" sx={{ minWidth: 300 }}>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mono"
                  sx={{ color: "var(--cyber-primary)", fontSize: "0.8rem" }}
                  IconComponent={FilterListIcon}
                >
                  <MenuItem value="ALL">[ FULL_OPERATIONAL_LOG ]</MenuItem>
                  <MenuItem value="SUBMITTED">[ PENDING_VERIFICATION ]</MenuItem>
                  <MenuItem value="APPROVED">[ AUTHORIZED_ASSETS ]</MenuItem>
                  <MenuItem value="REJECTED">[ TERMINATED_REQUESTS ]</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <AnimatePresence>
            {error && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                sx={{ mb: 4, p: 2, border: "1px solid var(--cyber-error)", backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              >
                <Typography className="mono" sx={{ color: "var(--cyber-error)", fontSize: "0.8rem", fontWeight: 700 }}>
                  ALERT: {error}
                </Typography>
              </Box>
            )}
          </AnimatePresence>

          <TableContainer className="cyber-module" sx={{ borderRadius: 0 }}>
            {loading ? (
              <Box sx={{ py: 15, textAlign: "center" }}>
                <CircularProgress size={48} sx={{ color: "var(--cyber-primary)", mb: 3 }} />
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>SCRAPING_LEDGER_DATA...</Typography>
              </Box>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <TableRow>
                    <TableCell className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.6rem", fontWeight: 900, borderBottom: "1px solid rgba(6,182,212,0.1)" }}>LOAN_ID</TableCell>
                    <TableCell className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.6rem", fontWeight: 900, borderBottom: "1px solid rgba(6,182,212,0.1)" }}>DETAILS</TableCell>
                    <TableCell className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.6rem", fontWeight: 900, borderBottom: "1px solid rgba(6,182,212,0.1)" }}>STATUS</TableCell>
                    <TableCell className="mono" sx={{ color: "var(--cyber-primary)", fontSize: "0.6rem", fontWeight: 900, borderBottom: "1px solid rgba(6,182,212,0.1)" }}>DATE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ py: 10, textAlign: "center", borderBottom: "none" }}>
                        <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                          // NO_TELEMETRY_FOUND_FOR_CURRENT_FILTER
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, idx) => (
                      <TableRow
                        key={row.id}
                        component={motion.tr}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        sx={{ "&:hover": { backgroundColor: "rgba(6,182,212,0.03)" } }}
                      >
                        <TableCell className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          #{row.id}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <Grid container>
                            <Grid size={{ xs: 12, md: 8 }}>
                              <Stack direction="row" spacing={3} alignItems="center" mb={2}>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>
                                  {row.full_name?.toUpperCase()}
                                </Typography>
                                <StatusChip status={row.status} />
                                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
                                  ID: {row.id}
                                </Typography>
                              </Stack>

                              <Grid container spacing={2}>
                                {[
                                  { l: "LOAN_AMOUNT", v: `$${row.amount?.toLocaleString()}` },
                                  { l: "TERM", v: `${row.tenure} MO` },
                                  { l: "MONTHLY_INCOME", v: `$${row.monthly_income?.toLocaleString() || 0}/MO` },
                                  { l: "DECISION", v: row.eligibility_decision || "PROCESSING..." }
                                ].map((field, i) => (
                                  <Grid size={{ xs: 6, sm: 3 }} key={i}>
                                    <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.55rem", mb: 0.5 }}>{field.l}</Typography>
                                    <Typography className="mono" sx={{ color: "white", fontWeight: 900, fontSize: "0.85rem" }}>{field.v}</Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <StatusChip status={row.status} />
                        </TableCell>
                        <TableCell className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {row.created_at ? new Date(row.created_at).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }).toUpperCase() : "---"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}
