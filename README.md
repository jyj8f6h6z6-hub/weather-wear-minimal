# 今天怎麼穿 v8 — 真實人物影像版

這版開始**完全不使用 SVG 人物**。人物改為重新生成的 raster fashion editorial 圖片（WebP），
網站只負責依「人物選擇 / 晴雨 / 走路或抵達」切換圖片。

## v8 這次真正改掉的地方

- 舊的 Q 版 / 卡通人物不再使用。
- `assets/characters-v8/` 內是新的時尚人物影像。
- 人物選擇首頁直接用 editorial 照片。
- 旅程結果改成左右兩張 fashion image：左邊出發、右邊抵達。
- 雨天人物有真正雨傘、衣物、包袋與走路動態，不是程式拼裝。
- 版面拿掉大圓形、斜線雨幕、幼兒卡片感。

## 目前人物素材

v8 先把畫風確立為：
- A：City Boy / Clean casual
- B：日韓 casual chic / IG fashion
- `dry`：一般晴 / 無雨
- `rain`：雨天
- `walk`：出發 / 行走
- `stand`：抵達 / 站定

後續若要再細分 30°C、20°C、10°C 的服裝，只要新增相同結構的圖檔，不需要重寫網站核心。

## 更新到 GitHub

1. 解壓縮。
2. 用這版檔案覆蓋既有專案。
3. 把你自己的 API Key 放回 `config.js`。
4. Live Server 先測試。
5. VS Code → Source Control → Commit → Sync Changes。

不要重新 Initialize Repository，也不用重新設定 GitHub Pages。
