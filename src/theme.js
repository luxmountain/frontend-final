import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: ({ ownerState }) => ({
          ...(ownerState.color !== 'error' && {
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }),
        }),
        outlined: ({ ownerState }) => ({
          ...(ownerState.color !== 'error' && {
            backgroundColor: 'transparent',
            color: 'black',
            borderColor: 'black',
            '&:hover': {
              backgroundColor: '#f0f0f0',
              borderColor: '#444',
            },
          }),
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'black',
          color: 'white',
        },
      },
    },
  },
});

export default theme;
