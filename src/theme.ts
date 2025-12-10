import { createTheme } from '@mui/material';

// Dark Mode 主題 (搖滾風！)
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9', // 淺藍色
        },
        secondary: {
            main: '#f48fb1', // 粉紅色 (適合 ZUTOMAYO 風格)
        },
        background: {
            default: '#121212', // 深黑色背景
            paper: '#1e1e1e',   // 卡片背景
        },
    },
});

// Light Mode 主題 (未來可用)
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // 藍色
        },
        secondary: {
            main: '#dc004e', // 紅色
        },
        background: {
            default: '#fafafa', // 淺灰色背景
            paper: '#ffffff',   // 白色卡片背景
        },
    },
});
