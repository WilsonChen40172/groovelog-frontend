import { useEffect, useState } from 'react';
import axios from 'axios';

// import { useStyles } from "./appStyle";

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
  Stack
} from '@mui/material';

// MUI Icons 導入
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

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

// 定義資料型別
type Song = {
  id: number;
  title: string;
  artist: string | null;
  status: 'WANT_TO_PLAY' | 'PRACTICING' | 'MASTERED';
};

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const fetchSongs = () => {
    axios.get('http://localhost:3000/songs')
      .then((res) => setSongs(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSubmit = async () => {
    if (!title) return;
    try {
      await axios.post('http://localhost:3000/songs', { title, artist });
      setTitle('');
      setArtist('');
      fetchSongs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // ThemeProvider: 注入主題樣式
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline: 類似 normalize.css，並套用背景色 */}
      <CssBaseline />

      <Container maxWidth="sm" sx={{ py: 4 }}>

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
                  <IconButton edge="end" aria-label="delete" color="error">
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
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {song.artist || 'Unknown Artist'}
                      </Typography>
                      {/* 狀態標籤 */}
                      <Box component="span" sx={{ ml: 1 }}>
                        <Chip
                          label={song.status}
                          size="small"
                          color={song.status === 'MASTERED' ? 'success' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                    </>
                  }
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

      </Container>
    </ThemeProvider>
  );
}

export default App;