import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Enhanced color palette with more professional shades
const lightPalette = {
  primary: {
    main: "#2563eb", // Modern blue
    light: "#3b82f6",
    dark: "#1d4ed8",
    contrastText: "#fff",
  },
  secondary: {
    main: "#6366f1", // Indigo
    light: "#818cf8",
    dark: "#4f46e5",
    contrastText: "#fff",
  },
  success: {
    main: "#10b981", // Emerald
    light: "#34d399",
    dark: "#059669",
    contrastText: "#fff",
  },
  error: {
    main: "#ef4444", // Red
    light: "#f87171",
    dark: "#dc2626",
    contrastText: "#fff",
  },
  warning: {
    main: "#f59e0b", // Amber
    light: "#fbbf24",
    dark: "#d97706",
    contrastText: "#fff",
  },
  info: {
    main: "#0ea5e9", // Sky blue
    light: "#38bdf8",
    dark: "#0284c7",
    contrastText: "#fff",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  background: {
    default: "#f9fafb", // Very light gray
    paper: "#ffffff",
    highlight: "#f0f9ff", // Very light blue for highlighted sections
  },
  text: {
    primary: "#1e293b", // Slate 800
    secondary: "#64748b", // Slate 500
    disabled: "rgba(0, 0, 0, 0.38)",
  },
  divider: "rgba(0, 0, 0, 0.08)",
};

const darkPalette = {
  primary: {
    main: "#60a5fa", // Blue 400
    light: "#93c5fd",
    dark: "#3b82f6",
    contrastText: "#0f172a",
  },
  secondary: {
    main: "#a5b4fc", // Indigo 300
    light: "#c7d2fe",
    dark: "#818cf8",
    contrastText: "#0f172a",
  },
  success: {
    main: "#34d399", // Emerald 400
    light: "#6ee7b7",
    dark: "#10b981",
    contrastText: "#0f172a",
  },
  error: {
    main: "#f87171", // Red 400
    light: "#fca5a5",
    dark: "#ef4444",
    contrastText: "#0f172a",
  },
  warning: {
    main: "#fbbf24", // Amber 400
    light: "#fcd34d",
    dark: "#f59e0b",
    contrastText: "#0f172a",
  },
  info: {
    main: "#38bdf8", // Sky 400
    light: "#7dd3fc",
    dark: "#0ea5e9",
    contrastText: "#0f172a",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#d5d5d5",
    A200: "#aaaaaa",
    A400: "#303030",
    A700: "#616161",
  },
  background: {
    default: "#0f172a", // Slate 900
    paper: "#1e293b", // Slate 800
    highlight: "#1e40af", // Blue 800 for highlighted sections
  },
  text: {
    primary: "#f8fafc", // Slate 50
    secondary: "#cbd5e1", // Slate 300
    disabled: "rgba(255, 255, 255, 0.5)",
  },
  divider: "rgba(255, 255, 255, 0.12)",
};

// Typography with improved readability and professional font settings
const typography = {
  fontFamily: '"Inter var", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontWeight: 800,
    fontSize: "3rem",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    marginBottom: "0.5em",
  },
  h2: {
    fontWeight: 700,
    fontSize: "2.25rem",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    marginBottom: "0.5em",
  },
  h3: {
    fontWeight: 700,
    fontSize: "1.875rem",
    lineHeight: 1.2,
    letterSpacing: "-0.005em",
    marginBottom: "0.5em",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.3,
    letterSpacing: 0,
    marginBottom: "0.5em",
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.4,
    letterSpacing: 0,
    marginBottom: "0.5em",
  },
  h6: {
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: 1.4,
    letterSpacing: 0,
    marginBottom: "0.5em",
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  body1: {
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  body2: {
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  button: {
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.75,
    letterSpacing: "0.01em",
    textTransform: "none",
  },
  caption: {
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: 0,
  },
  overline: {
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: 2.5,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
};

// Enhanced components styling for a more professional look
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      '::selection': {
        backgroundColor: 'rgba(37, 99, 235, 0.2)', // Light blue selection
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "10px 20px",
        fontWeight: 600,
        boxShadow: 'none',
        transition: "all 0.2s ease-in-out",
        textTransform: "none",
      },
      contained: {
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "&:hover": {
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
          transform: "translateY(-1px)",
        },
      },
      outlined: {
        borderWidth: "1.5px",
        "&:hover": {
          borderWidth: "1.5px",
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      },
      text: {
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      },
      sizeLarge: {
        padding: "12px 24px",
        fontSize: "1rem",
      },
      sizeSmall: {
        padding: "6px 12px",
        fontSize: "0.75rem",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          transform: "translateY(-4px)",
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: "24px 24px 0 24px",
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "24px",
        "&:last-child": {
          paddingBottom: "24px",
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          transition: "all 0.2s ease-in-out",
          "&.Mui-focused": {
            boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
      },
      colorDefault: {
        backgroundColor: "#fff",
      }
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      }
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        minWidth: 'auto',
        padding: "12px 16px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        }
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
        fontSize: "0.75rem",
        height: 24,
      },
      sizeSmall: {
        height: 20,
      },
      colorPrimary: {
        backgroundColor: "#2563eb24", // Increased opacity for better contrast
        color: "#0d4ed8", // Darker blue for better visibility on light backgrounds
      },
      colorSecondary: {
        backgroundColor: "#6366f124", // Increased opacity
        color: "#4f46e5", // Darker purple for better visibility
      },
      colorSuccess: {
        backgroundColor: "#10b98124", // Increased opacity
        color: "#059669", // Darker green for better visibility
      },
      colorError: {
        backgroundColor: "#ef444424", // Increased opacity
        color: "#b91c1c", // Darker red for better visibility
      },
      colorWarning: {
        backgroundColor: "#f59e0b24", // Increased opacity
        color: "#b45309", // Darker amber for better visibility 
      },
      colorInfo: {
        backgroundColor: "#0ea5e924", // Increased opacity
        color: "#0369a1", // Darker sky blue for better visibility
      },
      filled: {
        // Enhanced contrast for filled chips
        color: "#ffffff",
      },
      filledPrimary: {
        backgroundColor: "#2563eb", // Full opacity for better contrast
        color: "#ffffff", // White text for maximum contrast
      },
      filledSecondary: {
        backgroundColor: "#6366f1",
        color: "#ffffff",
      },
      filledSuccess: {
        backgroundColor: "#10b981",
        color: "#ffffff",
      },
      filledError: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
      },
      filledWarning: {
        backgroundColor: "#f59e0b",
        color: "#ffffff",
      },
      filledInfo: {
        backgroundColor: "#0ea5e9",
        color: "#ffffff",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 16,
      },
      elevation1: {
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
      },
      elevation2: {
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      },
      elevation3: {
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
      elevation4: {
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontSize: "0.875rem",
      },
      standardSuccess: {
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        color: "#059669",
      },
      standardError: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#dc2626",
      },
      standardWarning: {
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        color: "#d97706",
      },
      standardInfo: {
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        color: "#0284c7",
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
        fontWeight: 500,
        transition: "color 0.2s ease-in-out",
        "&:hover": {
          textDecoration: "none",
          opacity: 0.8,
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: "#2563eb",
        color: "#fff",
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "rgba(0, 0, 0, 0.08)",
      }
    }
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 4,
        "&.Mui-selected": {
          backgroundColor: "rgba(37, 99, 235, 0.1)",
        }
      }
    }
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        fontSize: "0.875rem",
      }
    }
  },
  MuiCircularProgress: {
    styleOverrides: {
      colorPrimary: {
        color: "#2563eb",
      }
    }
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: "#1e293b",
        fontSize: "0.75rem",
        padding: "6px 12px",
        borderRadius: 4,
      }
    }
  },
};

// Create responsive theme settings
const createResponsiveTheme = (palette, mode = 'light') => {
  const baseTheme = createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography,
    components: mode === 'dark' ? {
      ...components,
      MuiPaper: {
        ...components.MuiPaper,
        styleOverrides: {
          ...components.MuiPaper.styleOverrides,
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiChip: {
        ...components.MuiChip,
        styleOverrides: {
          ...components.MuiChip.styleOverrides,
          colorPrimary: {
            backgroundColor: "rgba(96, 165, 250, 0.12)",
            color: "#60a5fa",
          },
          colorSecondary: {
            backgroundColor: "rgba(165, 180, 252, 0.12)",
            color: "#a5b4fc",
          },
          colorSuccess: {
            backgroundColor: "rgba(52, 211, 153, 0.12)",
            color: "#34d399",
          },
          colorError: {
            backgroundColor: "rgba(248, 113, 113, 0.12)",
            color: "#f87171",
          },
          colorWarning: {
            backgroundColor: "rgba(251, 191, 36, 0.12)",
            color: "#fbbf24",
          },
          colorInfo: {
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            color: "#38bdf8",
          },
        },
      },
    } : components,
    shape: {
      borderRadius: 8,
    },
    shadows: [
      "none",
      "0 1px 2px 0 rgba(0,0,0,0.05)",
      "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      ...Array(19).fill("none"),
    ],
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    },
  });

  return responsiveFontSizes(baseTheme, {
    factor: 1.2,
  });
};

const lightTheme = createResponsiveTheme(lightPalette, 'light');
const darkTheme = createResponsiveTheme(darkPalette, 'dark');

export { lightTheme, darkTheme };
