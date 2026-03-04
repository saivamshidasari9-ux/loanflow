import { createTheme } from "@mui/material/styles";

export const CyberTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#06b6d4", // Neon Cyan
            light: "#22d3ee",
            dark: "#0891b2",
        },
        secondary: {
            main: "#8b5cf6", // Data Violet
            light: "#a78bfa",
            dark: "#7c3aed",
        },
        background: {
            default: "#030712",
            paper: "rgba(15, 23, 42, 0.4)",
        },
        text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
        },
        error: {
            main: "#f43f5e",
        },
        success: {
            main: "#10b981",
        },
    },
    typography: {
        fontFamily: "'Outfit', sans-serif",
        h1: { fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase" },
        h2: { fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase" },
        h3: { fontWeight: 800, letterSpacing: "-0.02em" },
        h4: { fontWeight: 800, letterSpacing: "-0.01em" },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: {
            textTransform: "uppercase",
            fontWeight: 800,
            letterSpacing: "0.1em",
            fontFamily: "'JetBrains Mono', monospace",
        },
    },
    shape: {
        borderRadius: 0, // Sharp tactical edges
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    position: "relative",
                    "&:hover": {
                        backgroundColor: "rgba(6, 182, 212, 0.1)",
                        borderColor: "#06b6d4",
                        boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)",
                    },
                    "&::before": {
                        content: "''",
                        position: "absolute",
                        top: -1,
                        left: -1,
                        width: 8,
                        height: 8,
                        borderTop: "2px solid #06b6d4",
                        borderLeft: "2px solid #06b6d4",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "rgba(15, 23, 42, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(6, 182, 212, 0.15)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        "& fieldset": {
                            borderColor: "rgba(148, 163, 184, 0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(6, 182, 212, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#06b6d4",
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "rgba(6, 182, 212, 0.1)",
                    color: "#f8fafc",
                    fontFamily: "'JetBrains Mono', monospace",
                },
                head: {
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                },
            },
        },
    },
});
