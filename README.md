# 🎸 GrooveLog Frontend

這是 **GrooveLog 練琴日記** 的前端應用程式。
一個專為樂手設計的練習進度追蹤工具，採用現代化的 **React** 與 **Material UI** 暗色系介面設計，讓練琴也能很有儀式感。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![MUI](https://img.shields.io/badge/MUI-v5-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ 特色功能 (Features)

- **📝 練習清單管理**：即時新增、查看、刪除練習曲目
- **🔄 狀態更新**：下拉式選單快速更改曲目練習狀態（練習中/已精通）
- **⏱️ 防呆機制**：狀態更新後 10 秒內禁用選單，防止連續點擊
- **🌑 沉浸式 Dark Mode**：全域暗色主題，保護眼睛並提供專業質感
- **🗑️ 防呆刪除機制**：刪除曲目時彈出確認視窗，防止誤刪
- **📱 響應式設計**：使用 MUI 元件與 Flexbox，完美適配各裝置
- **🔌 前後端分離架構**：透過 Axios 與後端 RESTful API 通訊

---

## 🛠 技術堆疊 (Tech Stack)

| 技術            | 版本 | 用途         |
| --------------- | ---- | ------------ |
| **React**       | 18   | UI 框架      |
| **TypeScript**  | 5.0+ | 型別檢查     |
| **Vite**        | 5.0+ | 快速建構工具 |
| **Material UI** | v5   | UI 元件庫    |
| **MUI Icons**   | -    | 圖示集       |
| **Axios**       | -    | HTTP 客戶端  |

---

## 🚀 快速開始 (Quick Start)

### 環境要求

- Node.js v18+
- npm 或 yarn

### 1️⃣ 安裝依賴

```bash
npm install
```

### 2️⃣ 設定後端連線

後端服務預設運行在 `http://localhost:3000`。

如需修改，請編輯 `src/services/api.ts`：

```typescript
const API_BASE_URL = "http://localhost:3000"; // 修改這裡
```

### 3️⃣ 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

### 4️⃣ 建構生產版本

```bash
npm run build
```

---

## 📂 專案結構

```
src/
├── App.tsx              # 主應用元件
├── AppStyle.ts          # 樣式組件定義 (styled-components)
├── theme.ts             # 主題配置 (深色/淺色)
├── main.tsx             # 程式進入點
├── index.css            # 全域樣式
├── types/
│   └── index.ts         # TypeScript 型別定義 (Song, etc.)
├── services/
│   └── api.ts           # API 服務層 (Axios 設定與封裝)
└── assets/              # 靜態資源
```

### 檔案說明

| 檔案              | 說明                               |
| ----------------- | ---------------------------------- |
| `App.tsx`         | 主應用邏輯與狀態管理               |
| `AppStyle.ts`     | 所有 styled components（樣式分離） |
| `theme.ts`        | 主題配置（深色/淺色模式）          |
| `services/api.ts` | API 呼叫封裝與 Axios 配置          |
| `types/index.ts`  | 資料模型與介面定義                 |

---

## 🎨 主題與樣式

### 切換主題

編輯 `src/App.tsx`，改變 `ThemeProvider` 的 theme props：

```typescript
// 深色模式（預設）
<ThemeProvider theme={darkTheme}>

// 淺色模式
<ThemeProvider theme={lightTheme}>
```

### 自訂主題顏色

編輯 `src/theme.ts`：

```typescript
export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#90caf9", // 修改主色調
    },
    secondary: {
      main: "#f48fb1", // 修改副色調
    },
    // ...
  },
});
```

---

## 🔗 API 端點

本應用依賴後端提供以下 API：

| 方法     | 端點                | 說明         |
| -------- | ------------------- | ------------ |
| `GET`    | `/songs`            | 取得所有歌曲 |
| `POST`   | `/songs`            | 新增歌曲     |
| `DELETE` | `/songs/:id`        | 刪除歌曲     |
| `PUT`    | `/songs/:id/status` | 更新歌曲狀態 |

### 範例請求

```typescript
// 取得所有歌曲
const songs = await songApi.getAll();

// 新增歌曲
const newSong = await songApi.create({ title: "歌名", artist: "藝人" });

// 刪除歌曲
await songApi.delete(songId);

// 更新狀態
await songApi.updateStatus(songId, "MASTERED");
```

---

## 📝 開發筆記

### State 管理

本應用使用 React Hooks 管理狀態，主要包括：

- `songs` - 歌曲列表
- `title`, `artist` - 新增表單輸入
- `openDialog`, `deleteId` - 刪除確認視窗
- `disabledSongs` - 追蹤被禁用的選單（防連續點擊）

### 樣式組織

所有 styled components 都在 `AppStyle.ts` 中集中定義，保持 JSX 簡潔清晰：

```typescript
export const AddSongPaper = styled(Paper)({
  padding: "24px",
  // ...
});
```

### 類型定義

所有資料類型在 `types/index.ts` 定義，確保型別安全：

```typescript
export interface Song {
  id: number;
  title: string;
  artist?: string;
  status: "PRACTICING" | "MASTERED";
}
```

---

## 🐛 常見問題

**Q: 為什麼頁面顯示空白？**  
A: 請確保後端服務已啟動並運行在 `http://localhost:3000`

**Q: 如何修改 API 請求的超時時間？**  
A: 編輯 `src/services/api.ts` 中的 Axios 配置

**Q: 如何新增其他主題？**  
A: 在 `theme.ts` 中建立新的 `createTheme` 物件，然後在 `App.tsx` 中使用

---

## 📄 授權

MIT License - 詳見 LICENSE 檔案
