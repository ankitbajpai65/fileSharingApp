"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: '#292524',
    //         light: '#fafaf9',
    //         dark: '#57534e',
    //     },
    // },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: '#80808033',
                    left: '2rem'
                }
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    // textAlign:'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: 'white'
                }
            },
        },
    },
});

export default function ThemeContext({ children }) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}