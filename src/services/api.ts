import axios from 'axios';
import type { Song, CreateSongDTO } from '../types';

// 1. 建立一個 Axios 實體 (Instance)
// 這樣以後要改網址，或加 Token Header，只要改這裡
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000, // 5秒超時設定
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. 封裝 API 函式
// 這裡我們直接回傳 data，讓 Component 拿到就是乾淨的資料
export const songApi = {
    // 取得所有歌曲
    getAll: async (): Promise<Song[]> => {
        const response = await apiClient.get<Song[]>('/songs');
        return response.data;
    },

    // 新增歌曲
    create: async (data: CreateSongDTO): Promise<Song> => {
        const response = await apiClient.post<Song>('/songs', data);
        return response.data;
    },

    // 刪除歌曲
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/songs/${id}`);
    },

    // (預留) 更新歌曲狀態
    // updateStatus: async (id: number, status: SongStatus) => { ... }
};

export default songApi;