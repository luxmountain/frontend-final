import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "white", // ✅ Màu trắng cho label
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "black",
          color: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "#333",
          },
        },
        outlined: {
          backgroundColor: "transparent",
          color: "black",
          borderColor: "black",
          "&:hover": {
            backgroundColor: "#f0f0f0",
            borderColor: "#444",
          },
        },
      },
    },
  },
});

export default theme;
