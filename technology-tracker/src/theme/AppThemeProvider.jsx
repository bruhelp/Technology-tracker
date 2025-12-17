import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: '#40e0d0',
            },
            secondary: {
                main: '#f18daf',
            },
            background: {
                default: mode === 'light' ? '#f5f7fa' : '#dbdbdbff',
            },
            success: {
                main: '#f18daf',
            },
            error: {
                main: '#4c5467',
            },
            warning: {
                main: '#64cacc',
            },
            info: {
                main: '#4d89a3',
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { textTransform: 'none', fontWeight: 600 },
                },
            },
        },
    }), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> 
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};