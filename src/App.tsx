import { useEffect, useState } from 'react';

// MUI 元件導入
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled
} from '@mui/material';

// MUI Icons 導入
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import type { Song } from './types';
import songApi from './services/api';

// Styled 元件
const AppContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

// 1. 設定 Dark Mode 主題 (這就是搖滾風！)
const darkTheme = createTheme({
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

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const [openDialog, setOpenDialog] = useState(false); // 彈窗開關
  const [deleteId, setDeleteId] = useState<number | null>(null); // 暫存要刪除的 ID

  const fetchSongs = async () => {
    try {
      const data = await songApi.getAll(); // 這裡直接拿到 data，不用再 .data
      setSongs(data);
    } catch (error) {
      console.error("讀取失敗", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSubmit = async () => {
    if (!title) return;
    try {
      // await axios.post('http://localhost:3000/songs', { title, artist });
      const data = await songApi.create({ title, artist });
      console.log("新增成功", data); // 之後做成顯示成功alert
      setTitle('');
      setArtist('');
      fetchSongs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDelete = (id: number) => {
    setDeleteId(id); // 記住這首歌
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    try {
      const data = await songApi.delete(deleteId);
      console.log("刪除成功", data);
      // 刪除成功後：
      setOpenDialog(false); // 關閉彈窗
      setDeleteId(null);    // 清空 ID
      fetchSongs();         // 重新抓取列表
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };

  return (
    <AppContainer>
      {/* ThemeProvider: 注入主題樣式 */}
      <ThemeProvider theme={darkTheme}>
        {/* CssBaseline: 類似 normalize.css，並套用背景色 */}
        <CssBaseline />

        <Container sx={{

          py: 4
        }} maxWidth="sm">

          {/* 標題區塊 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <LibraryMusicIcon color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              GrooveLog
            </Typography>
          </Box>

          {/* 新增歌曲卡片 (Paper 取代 div) */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🎸 新增練習曲目
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Stack spacing={2}>
                <TextField
                  label="歌名 (Title)"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如: 勘冴えて悔しいわ"
                />
                <TextField
                  label="演出者 (Artist)"
                  variant="outlined"
                  fullWidth
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="例如: ZUTOMAYO"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleSubmit}
                  size="large"
                >
                  加入練習清單
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* 歌曲列表 */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            練習中 ({songs.length})
          </Typography>

          <List>
            {songs.map((song) => (
              <Paper key={song.id} sx={{ mb: 2, overflow: 'hidden' }}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleClickDelete(song.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {/* 左側圖示 */}
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <MusicNoteIcon />
                    </Avatar>
                  </ListItemAvatar>

                  {/* 文字內容 */}
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="span">
                        {song.title}
                      </Typography>
                    }
                    secondary={song.artist || 'Unknown Artist'}
                  />
                  {/* 狀態標籤放在 ListItemText 外面 */}
                  <Chip
                    label={song.status}
                    size="small"
                    color={song.status === 'MASTERED' ? 'success' : 'primary'}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </ListItem>
              </Paper>
            ))}

            {songs.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <PlayCircleOutlineIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                <Typography>目前沒有練習曲目，快去新增吧！</Typography>
              </Box>
            )}
          </List>


          {/* --- 🆕 這裡就是那個彈窗 (Dialog) 元件 --- */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon color="warning" />
              確認刪除？
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                刪除後就救不回來囉！你確定要放棄這首歌的練習進度嗎？
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">
                算了我再練練
              </Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                刪除它
              </Button>
            </DialogActions>
          </Dialog>

        </Container>
      </ThemeProvider>
    </AppContainer>
  );
}

export default App;