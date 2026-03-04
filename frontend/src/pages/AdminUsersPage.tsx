// src/pages/AdminUsersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AppHeader from "../components/AppHeader";
import {
  AdminUser,
  listAdminUsers,
  updateUserActive,
  updateUserRole,
  Role,
} from "../api/admin";

export default function AdminUsersPage() {
  const [params] = useSearchParams();
  const roleParam = (params.get("role") as Role | null) || null;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (roleParam === "CUSTOMER") return "CUSTOMER_NODES";
    if (roleParam === "ANALYST") return "ANALYST_RESOURCES";
    if (roleParam === "ADMIN") return "GOVERNANCE_ENTITIES";
    return "GLOBAL_IDENTITIES";
  }, [roleParam]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listAdminUsers(roleParam || undefined);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [roleParam]);

  const changeRole = async (id: number, role: Role) => {
    await updateUserRole(id, role);
    await refresh();
  };

  const toggleActive = async (id: number, active: boolean) => {
    await updateUserActive(id, active);
    await refresh();
  };

  return (
    <Box sx={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <AppHeader showLogout pageTitle={`ADMIN // ${title}`} />

      <Box sx={{ py: { xs: 12, md: 16 }, px: 2 }}>
        <Container maxWidth="xl">
          <Box className="cyber-module" sx={{ p: { xs: 4, md: 6 }, mb: 4, borderLeft: "4px solid var(--cyber-primary)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                  {title}
                </Typography>
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  // IDENTITY_MANAGEMENT_SYSTEM // ACCESS_CONTROL_HANDSHAKE: [SECURED]
                </Typography>
              </Box>
              <Tooltip title="REFRESH_REGISTRY">
                <IconButton
                  onClick={refresh}
                  className="cyber-module"
                  sx={{
                    width: 56,
                    height: 56,
                    color: "var(--cyber-primary)",
                    "&:hover": { borderColor: "white", color: "white" }
                  }}
                >
                  <RefreshRoundedIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ py: 15, textAlign: "center" }}>
                <CircularProgress size={48} sx={{ color: "var(--cyber-primary)", mb: 3 }} />
                <Typography className="mono" sx={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>SYNCHRONIZING_IDENTITY_DATA...</Typography>
              </Box>
            ) : (
              <AnimatePresence>
                {users.map((u, idx) => (
                  <Box
                    key={u.id}
                    component={motion.div}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="cyber-module"
                    sx={{
                      p: 4,
                      "&:hover": { borderColor: "var(--cyber-primary)" }
                    }}
                  >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          fontSize: 20,
                          fontWeight: 900,
                          backgroundColor: "transparent",
                          border: "2px solid var(--cyber-primary)",
                          color: "var(--cyber-primary)",
                          fontFamily: "'JetBrains Mono', monospace",
                          borderRadius: 0,
                          boxShadow: "0 0 10px var(--cyber-glow)"
                        }}
                      >
                        {u.username.substring(0, 2).toUpperCase()}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: "white", mb: 0.5 }}>
                          {u.username.toUpperCase()}
                        </Typography>
                        <Stack direction="row" spacing={2} className="mono">
                          <Typography sx={{ fontSize: "0.6rem", color: "var(--cyber-primary)", fontWeight: 900 }}>ROLE: {u.role}</Typography>
                          <Typography sx={{ fontSize: "0.6rem", color: u.active ? "var(--cyber-accent)" : "var(--cyber-error)", fontWeight: 900 }}>STATUS: {u.active ? "ACTIVE" : "TERMINATED"}</Typography>
                        </Stack>
                      </Box>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <Select
                            value={u.role}
                            onChange={(e) => changeRole(u.id, e.target.value as Role)}
                            className="mono"
                            sx={{ color: "var(--cyber-primary)", fontSize: "0.75rem" }}
                          >
                            <MenuItem value="CUSTOMER">[ CUSTOMER_NODE ]</MenuItem>
                            <MenuItem value="ANALYST">[ RISK_ANALYST ]</MenuItem>
                            <MenuItem value="ADMIN">[ SUPREME_GOV ]</MenuItem>
                          </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography className="mono" sx={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 900 }}>OPERATIONAL</Typography>
                          <Switch
                            checked={u.active}
                            onChange={(e) => toggleActive(u.id, e.target.checked)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--cyber-accent)" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--cyber-accent)", opacity: 0.5 },
                              "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.05)" }
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
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
