"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#488BFF",
    },
  },
});

theme = createTheme(theme, {
  typography: {
    h4: {
      fontSize: "1.9rem",
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.8rem",
      },
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#80808033",
          left: "2rem",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
      variants: [
        {
          props: {
            variant: "contained",
          },
          style: {
            backgroundColor: theme.palette.primary.main,
            fontWeight: 600,
            transition: ".3s ease-in",
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
              boxShadow: "1px 1px 10px #75B5FF, 0px 0px 1px #75B5FF",
            },
          },
        },
      ],
    },
  },
});

export default function ThemeContext({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
