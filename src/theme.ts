'use client';
import {Open_Sans} from 'next/font/google';
import {createTheme} from '@mui/material/styles';

const openSan = Open_Sans({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ee0033',
            light: '#ff3355',
            dark: '#bb0022',
        },
        secondary: {
            main: '#44494d',
            light: '#6c7175',
            dark: '#1c1f21',
        },
    },
    typography: {
        fontFamily: openSan.style.fontFamily,
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ownerState}) => ({
                    ...(ownerState.severity === 'info' && {
                        backgroundColor: '#60a5fa',
                    }),
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
                },
            },
        },
    },
});

export default theme;