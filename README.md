# 今天怎麼穿？ v2

極簡穿搭天氣網站。先選人物 → 定位 → 附近 / 出門 → 直接看穿搭圖。

## 這版新增

- Google Maps / Places 目的地搜尋（Autocomplete）
- 搜尋會優先偏向目前位置附近
- 沒有 Google API Key 時仍可用備援地名搜尋測試網站
- 全新 Q 版人物：大頭比例、表情、腮紅、髮型、鞋子、背包
- 穿搭更清楚：短袖、長袖、薄外套、外套、厚外套、短褲、長褲、裙裝、雨傘
- 出門模式：左側人物「往右走」；右側人物為抵達狀態
- 目的地與目前位置有極簡天氣背景提示

---

## 第一次在 VS Code 開啟

1. 解壓縮資料夾。
2. VS Code → `File` → `Open Folder` → 選本資料夾。
3. 安裝 / 使用 Live Server。
4. 右鍵 `index.html` → `Open with Live Server`。

> 定位功能請用 localhost 或 GitHub Pages HTTPS，不要直接雙擊 index.html。

---

## Google Maps 搜尋：你只需要設定一次

### A. Google Cloud

1. 到 Google Cloud Console 建立一個 Project。
2. 建立 Billing account / 將專案連結計費。
3. 啟用：
   - `Maps JavaScript API`
   - `Places API (New)`
4. 建立 API Key。

### B. 把 Key 貼進網站

打開 `config.js`：

```js
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: '把你的 API Key 貼在這裡'
};
```

存檔後重新整理網頁。

### C. 正式上 GitHub 前一定要做 Key 限制

Google Cloud → Credentials → 你的 API Key：

- Application restrictions：`Websites (HTTP referrers)`
- 加入你的 GitHub Pages 網址，例如：
  `https://你的帳號.github.io/weather-wear-minimal/*`
- 本機測試可另外加入：
  `http://localhost/*`
  `http://127.0.0.1/*`
- API restrictions：只允許 `Maps JavaScript API`、`Places API (New)`

前端網站的 API Key 本來就會被瀏覽器看到，所以重點不是藏起來，而是「限制它只能在你的網站使用」。

---

## 第一次建立新的 GitHub 專案

VS Code 左側 Source Control：

1. `Initialize Repository`
2. Stage / Commit（例如：`first version`）
3. `Publish Branch`
4. GitHub repository 建議命名：`weather-wear-minimal`

接著 GitHub：

`Settings` → `Pages` → `Deploy from a branch` → `main` → `/(root)`

---

# 以後更新 GitHub，只記這句

## 改完 → Commit → Sync Changes

VS Code 左側 Source Control：

1. 看修改檔案。
2. Message 寫一句，例如 `update character design`。
3. `Commit`。
4. `Sync Changes`。

不用重新 Initialize、不用重新 Publish、不用重新設定 GitHub Pages。

---

## 目前資料來源

- 天氣：Open-Meteo
- 目的地搜尋：Google Maps Platform / Places（有設定 API Key 時）
- 備援搜尋：Open-Meteo Geocoding

目前「抵達時間」仍是依直線距離估算，還不是 Google 導航時間。若之後要做到真正汽車 / 大眾運輸抵達時間，可以再接 Routes API。
