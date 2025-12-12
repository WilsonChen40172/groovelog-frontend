// 定義通用的 API 回傳格式 (如果有統一包裝的話，目前我們直接回傳陣列)
// 但我們先把 Song 定義好
// export type SongStatus = 'WANT_TO_PLAY' | 'PRACTICING' | 'MASTERED';
export type SongStatus = string;

export interface Instrument {
    id: number;
    instrument: string; // e.g. "Guitar"
    progress: number;   // e.g. 50
}

export interface Song {
    id: number;
    title: string;
    artist: string | null;
    status: SongStatus;
    instruments: Instrument[];
}

// 定義新增歌曲時需要的參數 (通常不需要 id 和 status)
export interface CreateSongDTO {
    title: string;
    artist?: string;
    instruments?: string[]; // 可選的樂器陣列
}