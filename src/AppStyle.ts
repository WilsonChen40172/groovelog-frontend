import {
    Box,
    Paper,
    Container,
    DialogTitle,
    Select,
    styled
} from "@mui/material";
import { darkTheme } from "./theme";

// Styled 元件
export const AppContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
});

export const HeaderBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '16px',
});

export const AddSongPaper = styled(Paper)({
    padding: '24px',
    marginBottom: '32px',
    borderRadius: '8px',
});

export const StyledContainer = styled(Container)({
    paddingTop: '32px',
    paddingBottom: '32px',
});

export const SongPaper = styled(Paper)({
    marginBottom: '16px',
    overflow: 'hidden',
});

export const EmptyStateBox = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    paddingTop: '40px',
    paddingBottom: '40px',
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.6)',
}));

export const DialogTitleBox = styled(DialogTitle)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

// 動態 Styled 元件 - 根據狀態改變顏色
export const StatusSelect = styled(Select, {
    shouldForwardProp: (prop) => prop !== 'isMastered',
})<{ isMastered: boolean }>(({ isMastered, theme }) => ({
    color: isMastered ? theme.palette.success.main : theme.palette.primary.main,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isMastered ? theme.palette.success.main : theme.palette.primary.main,
    },
})); 