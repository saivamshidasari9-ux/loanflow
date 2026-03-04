// src/pages/LoanApplication.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "../components/AppHeader";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RadarIcon from '@mui/icons-material/Radar';

type EmploymentType = "SALARIED" | "SELF_EMPLOYED" | "STUDENT" | "UNEMPLOYED";
type Purpose = "HOME" | "AUTO" | "PERSONAL" | "EDUCATION" | "MEDICAL";

function DecisionChip({ decision }: { decision: "ELIGIBLE" | "REVIEW" | "REJECT" }) {
  const styles =
    decision === "ELIGIBLE"
      ? { label: "ELIGIBLE", color: "var(--cyber-accent)" }
      : decision === "REVIEW"
        ? { label: "MANUAL_REVIEW", color: "var(--cyber-primary)" }
        : { label: "TERMINATED", color: "var(--cyber-error)" };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        border: `1px solid ${styles.color}`,
        color: styles.color,
        fontSize: "0.6rem",
        fontWeight: 900,
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: "rgba(3,7,18,0.5)"
      }}
    >
      {styles.label}
    </Box>
  );
}

export default function LoanApplication() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [monthlyDebt, setMonthlyDebt] = useState<string>("");
  const [creditScore, setCreditScore] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("SALARIED");
  const [purpose, setPurpose] = useState<Purpose>("PERSONAL");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const canAnalyze = useMemo(() => {
    return fullName.trim() !== "" && amount.trim() !== "" && tenure.trim() !== "" &&
      monthlyIncome.trim() !== "" && monthlyDebt.trim() !== "" && creditScore.trim() !== "";
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  const analysis = useMemo(() => {
    if (!canAnalyze) return null;
    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    if ([amt, ten, income, debt, cs].some((n) => Number.isNaN(n))) return null;
    const dti = income > 0 ? debt / income : 1;
    let risk = 0;
    if (cs >= 780) risk += 10; else if (cs >= 740) risk += 20; else if (cs >= 700) risk += 35; else if (cs >= 650) risk += 50; else risk += 70;
    if (dti <= 0.2) risk += 5; else if (dti <= 0.35) risk += 20; else if (dti <= 0.5) risk += 40; else risk += 60;
    risk = Math.max(0, Math.min(100, risk));

    let decision: "ELIGIBLE" | "REVIEW" | "REJECT" = "ELIGIBLE";
    if (cs < 600 || dti > 0.6 || risk >= 80) decision = "REJECT";
    else if (cs < 680 || dti > 0.45 || risk >= 55) decision = "REVIEW";

    const rate = Math.round((7.5 + risk * 0.08) * 10) / 10;
    return { dti, risk, decision, rate };
  }, [canAnalyze, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  const completion = useMemo(() => {
    let score = 0;
    if (fullName.trim()) score += 20;
    if (amount.trim()) score += 20;
    if (tenure.trim()) score += 20;
    if (monthlyIncome.trim()) score += 20;
    if (monthlyDebt.trim()) score += 10;
    if (creditScore.trim()) score += 10;
    return Math.min(100, score);
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  const parseError = (e: any): string => {
    const data = e?.response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((err: any) => `${err.loc.join(".")}: ${err.msg}`).join(", ");
    }
    return e?.message || "SYSTEM_SUBMISSION_FAILURE";
  };

  const submit = async () => {
    setError("");
    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    if (!fullName.trim() || [amt, ten, income, debt, cs].some((n) => Number.isNaN(n))) {
      setError("VALIDATION_ERROR: FILL_ALL_FIELDS");
      return;
    }

    setSubmitting(true);
    try {
      await client.post("/api/loans/apply", {
        full_name: fullName,
        amount: amt,
        tenure: ten,
        monthly_income: income,
        monthly_debt: debt,
        credit_score: cs,
        employment_type: employmentType,
        purpose: purpose
      });
      setShowSuccessModal(true);
    } catch (e: any) {
      setError(parseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle="PROTOCOL_DEPLOYMENT_CONSOLE" />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box className="cyber-module" sx={{ p: { xs: 4, md: 6 }, mb: 4, borderLeft: "4px solid var(--cyber-primary)" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    border: "2px solid #fbbf24",
                    display: "grid",
                    placeItems: "center",
                    color: "#fbbf24",
                    boxShadow: "0 0 15px rgba(251,191,36,0.2)"
                  }}
                >
                  <AccountBalanceIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                    Loan Application
                  </Typography>
                  <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    // NEW_LOAN_REQUEST // SECURE_PROCESS
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ width: { xs: "100%", md: 400 } }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>SYNTHESIS_PROGRESS</Typography>
                  <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--cyber-primary)" }}>{completion}%</Typography>
                </Stack>
                <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <Box sx={{ height: "100%", width: `${completion}%`, backgroundColor: "var(--cyber-primary)", boxShadow: "0 0 10px var(--cyber-primary)", transition: "width 0.5s ease-out" }} />
                </Box>
              </Box>
            </Stack>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box className="cyber-module" sx={{ p: { xs: 5, md: 8 } }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 6, color: "white" }}>
                  Applicant Metadata
                </Typography>

                <AnimatePresence>
                  {error && (
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      sx={{ mb: 4, p: 2, border: "1px solid var(--cyber-error)", backgroundColor: "rgba(244, 63, 94, 0.1)" }}
                    >
                      <Typography className="mono" sx={{ color: "var(--cyber-error)", fontSize: "0.8rem", fontWeight: 700 }}>
                        ALERT: {error}
                      </Typography>
                    </Box>
                  )}
                </AnimatePresence>

                <Stack spacing={4}>
                  <TextField label="Full Legal Name" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} sx={goldInputStyles} className="mono" />

                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Loan Amount ($)" type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} sx={goldInputStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Loan Term (Months)" type="number" fullWidth value={tenure} onChange={(e) => setTenure(e.target.value)} sx={goldInputStyles} />
                    </Grid>
                  </Grid>

                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Yearly Income ($)" type="number" fullWidth value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} sx={goldInputStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Monthly Debt Payments ($)" type="number" fullWidth value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} sx={goldInputStyles} />
                    </Grid>
                  </Grid>

                  <TextField label="Credit Score (300-850)" type="number" fullWidth value={creditScore} onChange={(e) => setCreditScore(e.target.value)} sx={goldInputStyles} />

                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={goldInputStyles}>
                        <InputLabel>Employment Status</InputLabel>
                        <Select value={employmentType} label="Employment Status" onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}>
                          <MenuItem value="SALARIED">Full-time Job</MenuItem>
                          <MenuItem value="SELF_EMPLOYED">Self-Employed</MenuItem>
                          <MenuItem value="STUDENT">Student</MenuItem>
                          <MenuItem value="UNEMPLOYED">Currently Unemployed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={goldInputStyles}>
                        <InputLabel>Reason for Loan</InputLabel>
                        <Select value={purpose} label="Reason for Loan" onChange={(e) => setPurpose(e.target.value as Purpose)}>
                          <MenuItem value="HOME">Home Purchase</MenuItem>
                          <MenuItem value="AUTO">Car Loan</MenuItem>
                          <MenuItem value="PERSONAL">Personal Use</MenuItem>
                          <MenuItem value="EDUCATION">Education</MenuItem>
                          <MenuItem value="MEDICAL">Medical Expenses</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ pt: 4 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={submit}
                      disabled={submitting}
                      sx={{
                        py: 2.5,
                        backgroundColor: "#fbbf24",
                        color: "black",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        boxShadow: "0 0 20px rgba(251,191,36,0.3)",
                        "&:hover": { backgroundColor: "white" }
                      }}
                    >
                      {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box className="cyber-module" sx={{ p: 5, position: "sticky", top: 120 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <RadarIcon sx={{ color: "var(--cyber-primary)", fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>Neural Analysis</Typography>
                </Stack>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.6rem", mb: 6 }}>
                  // LIVE_ELIBILITY_TELEMETRY // SYNC_ACTIVE
                </Typography>

                <AnimatePresence mode="wait">
                  {!analysis ? (
                    <Box sx={{ py: 10, textAlign: "center", border: "1px dashed rgba(6,182,212,0.1)", backgroundColor: "rgba(3,7,18,0.2)" }}>
                      <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                        WAITING_FOR_DATA_PACKETS...
                      </Typography>
                    </Box>
                  ) : (
                    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Stack spacing={5}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={1.5}>
                            <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>DTI_RATIO</Typography>
                            <Typography className="mono" sx={{ fontSize: "0.6rem", color: analysis.dti > 0.4 ? "var(--cyber-error)" : "var(--cyber-accent)" }}>{(analysis.dti * 100).toFixed(1)}%</Typography>
                          </Stack>
                          <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                            <Box sx={{ height: "100%", width: `${Math.min(100, analysis.dti * 100)}%`, backgroundColor: analysis.dti > 0.4 ? "var(--cyber-error)" : "var(--cyber-accent)", boxShadow: `0 0 10px ${analysis.dti > 0.4 ? "var(--cyber-error)" : "var(--cyber-accent)"}` }} />
                          </Box>
                        </Box>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={1.5}>
                            <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>RISK_INDEX</Typography>
                            <Typography className="mono" sx={{ fontSize: "0.6rem", color: analysis.risk > 60 ? "var(--cyber-error)" : "var(--cyber-primary)" }}>{analysis.risk}/100</Typography>
                          </Stack>
                          <Box sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)" }}>
                            <Box sx={{ height: "100%", width: `${analysis.risk}%`, backgroundColor: analysis.risk > 60 ? "var(--cyber-error)" : "var(--cyber-primary)", boxShadow: `0 0 10px ${analysis.risk > 60 ? "var(--cyber-error)" : "var(--cyber-primary)"}` }} />
                          </Box>
                        </Box>

                        <Box sx={{ p: 4, border: "1px solid rgba(6,182,212,0.1)", backgroundColor: "rgba(3,7,18,0.5)" }}>
                          <Stack spacing={3}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>SYNTHESIS</Typography>
                              <DecisionChip decision={analysis.decision} />
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>CORE_APR</Typography>
                              <Typography className="mono" sx={{ fontSize: "1.5rem", color: "var(--cyber-primary)", fontWeight: 900 }}>{analysis.rate}%</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog
        open={showSuccessModal}
        onClose={() => navigate("/dashboard")}
        PaperProps={{
          className: "cyber-module",
          sx: { p: 6, maxWidth: 500, backgroundColor: "var(--bg-deep) !important" }
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "var(--cyber-accent)", mb: 4 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: "white", mb: 2 }}>TRANSMITTED</Typography>
          <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.85rem", mb: 6, lineHeight: 1.8 }}>
            Protocol payload successfully injected into the risk assessment engine. Verification node synchronization in progress.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              py: 2.5,
              backgroundColor: "white",
              color: "black",
              fontWeight: 900,
              "&:hover": { backgroundColor: "var(--cyber-primary)" }
            }}
          >
            RETURN_TO_COMMAND
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

const goldInputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    fontFamily: "'JetBrains Mono', monospace",
    borderRadius: 0,
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "rgba(251,191,36,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(251,191,36,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#fbbf24" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fbbf24" },
};
