import { useEffect, useState } from 'react';

// MUI 元件導入
import {
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ThemeProvider,
  CssBaseline,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  FormControl,
  Slider,
  Chip
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

// 導入主題
import { darkTheme, lightTheme } from './theme';

// 導入 Styled 元件
import {
  AppContainer,
  HeaderBox,
  AddSongPaper,
  StyledContainer,
  SongPaper,
  EmptyStateBox,
  DialogTitleBox,
  StatusSelect
} from './AppStyle';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  const [openDialog, setOpenDialog] = useState(false); // 彈窗開關
  const [deleteId, setDeleteId] = useState<number | null>(null); // 暫存要刪除的 ID
  const [disabledSongs, setDisabledSongs] = useState<Set<number>>(new Set()); // 記錄正在更新的歌曲 ID

  // 預設給這四個，使用者可以刪掉或增加
  const [instruments, setInstruments] = useState<string[]>(['Vocal', 'Guitar', 'Bass', 'Drum']);
  // 用來暫存使用者正在輸入的樂器名稱
  const [tempInstrument, setTempInstrument] = useState('');

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
      const data = await songApi.create({
        title, artist,
        instruments: instruments
      });
      console.log("新增成功", data); // 之後做成顯示成功alert
      setTitle('');
      setArtist('');
      setInstruments(['Vocal', 'Guitar', 'Bass', 'Drum']);
      fetchSongs();
    } catch (error) {
      console.error(error);
    }
  };

  // 處理進度條拖拉變更
  const handleProgressChange = async (instrumentId: number, newValue: number | number[]) => {
    // 這裡為了效能，通常會做 Debounce (防抖)，但練習先直接打 API
    try {
      await songApi.updateProgress(instrumentId, newValue as number);
      // 為了畫面流暢，這裡建議先更新本地 state，或者重新 fetch
      fetchSongs();
    } catch (error) { console.error(error); }
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    // 防止重複更新
    if (disabledSongs.has(id)) return;

    try {
      // 標記為 disabled
      setDisabledSongs(prev => new Set(prev).add(id));

      await songApi.updateStatus(id, newStatus);
      console.log("狀態更新成功");
      fetchSongs(); // 重新抓取列表

      // 10 秒後解除 disabled
      setTimeout(() => {
        setDisabledSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 10000);
    } catch (error) {
      console.error("狀態更新失敗", error);
      // 如果失敗，立即解除 disabled
      setDisabledSongs(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAddInstrument = () => {
    // 防呆：如果是空的，或已經在清單裡，就不加
    if (!tempInstrument.trim() || instruments.includes(tempInstrument)) return;

    setInstruments([...instruments, tempInstrument]); // 加進陣列
    setTempInstrument(''); // 清空輸入框
  };

  // 刪除樂器
  const handleDeleteInstrument = (instToDelete: string) => {
    setInstruments(instruments.filter((inst) => inst !== instToDelete));
  };

  return (
    <AppContainer>
      {/* 更改主題樣式按鈕 */}
      <Button
        variant="outlined"
        onClick={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
      >
        切換到 {themeMode === 'light' ? '深色' : '淺色'} 主題
      </Button>
      {/* ThemeProvider: 注入主題樣式 */}
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        {/* CssBaseline: 類似 normalize.css，並套用背景色 */}
        <CssBaseline />

        <StyledContainer maxWidth="sm">

          {/* 標題區塊 */}
          <HeaderBox>
            <LibraryMusicIcon color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              GrooveLog
            </Typography>
          </HeaderBox>

          {/* 新增歌曲卡片 (Paper 取代 div) */}
          <AddSongPaper elevation={3}>
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
                {/* 👇👇👇 4. 這裡插入樂器輸入區塊 👇👇👇 */}
                <Box sx={{ p: 2, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    配置樂器 (可自由增刪)
                  </Typography>

                  {/* 顯示已加入的樂器標籤 (Chips) */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {instruments.map((inst) => (
                      <Chip
                        key={inst}
                        label={inst}
                        onDelete={() => handleDeleteInstrument(inst)} // 顯示刪除叉叉
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  {/* 輸入與新增按鈕 */}
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="自訂樂器 (如: Keyboard)"
                      size="small"
                      value={tempInstrument}
                      onChange={(e) => setTempInstrument(e.target.value)}
                      fullWidth
                      // 按下 Enter 也可以新增，體驗更好
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // 防止送出整個表單
                          handleAddInstrument();
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddInstrument}
                      disabled={!tempInstrument}
                    >
                      加入
                    </Button>
                  </Stack>
                </Box>
                {/* 👆👆👆 樂器區塊結束 👆👆👆 */}
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
          </AddSongPaper>

          {/* 歌曲列表 */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            練習中 ({songs.length})
          </Typography>

          <List>
            {songs.map((song) => (
              <SongPaper key={song.id}>
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



                  {/* 狀態下拉選單 */}
                  <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                    <StatusSelect
                      value={song.status}
                      onChange={(e) => handleUpdateStatus(song.id, e.target.value as string)}
                      disabled={disabledSongs.has(song.id)}
                      variant="outlined"
                      isMastered={song.status === 'MASTERED'}
                    >
                      <MenuItem value="PRACTICING">練習中</MenuItem>
                      <MenuItem value="MASTERED">已精通</MenuItem>
                    </StatusSelect>
                  </FormControl>
                </ListItem>

                {/* --- 🆕 下半部：樂器軌道與進度條 --- */}
                {song.instruments && song.instruments.length > 0 && (
                  <Box sx={{ px: 3, pb: 2, pt: 0 }}>
                    {/* 加一條分隔線或間距讓視覺分開 */}
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mb: 2 }} />

                    <Stack spacing={1}>
                      {song.instruments.map((inst) => (
                        <Box key={inst.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                          {/* 1. 樂器名稱 (固定寬度以免對不齊) */}
                          <Typography
                            variant="caption"
                            sx={{
                              minWidth: 50,
                              color: 'text.secondary',
                              fontWeight: 'bold',
                              textTransform: 'uppercase'
                            }}
                          >
                            {inst.instrument}
                          </Typography>

                          {/* 2. 進度拉桿 (Slider) */}
                          <Slider
                            size="small"
                            defaultValue={inst.progress} // 使用 defaultValue 讓它更順暢
                            // 使用 onChangeCommitted：只有放開滑鼠時才送出 API 請求
                            onChangeCommitted={(_, val) => handleProgressChange(inst.id, val)}
                            valueLabelDisplay="auto" // 拖拉時顯示數字泡泡
                            sx={{
                              flex: 1,
                              color: inst.progress === 100 ? '#66bb6a' : 'primary.main', // 100% 變綠色
                            }}
                          />

                          {/* 3. 進度數字 */}
                          <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right' }}>
                            {inst.progress}%
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </SongPaper>
            ))}

            {songs.length === 0 && (
              <EmptyStateBox>
                <PlayCircleOutlineIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                <Typography>目前沒有練習曲目，快去新增吧！</Typography>
              </EmptyStateBox>
            )}
          </List>


          {/* --- 🆕 這裡就是那個彈窗 (Dialog) 元件 --- */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitleBox id="alert-dialog-title">
              <WarningAmberIcon color="warning" />
              確認刪除？
            </DialogTitleBox>
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

        </StyledContainer>
      </ThemeProvider>
    </AppContainer>
  );
}

export default App;