# 今天怎麼穿 v9

這版修正 v8 最嚴重的問題：人物不再是從整張 App mockup 裁成長條照片。

## v9
- `assets/characters-v9/`：獨立透明 PNG 人物素材。
- 首頁人物選擇只顯示人物，不再出現搜尋框、文字、城市 UI 殘影。
- 結果頁不再用兩張直式照片卡。
- 左邊人物直接浮在頁面上，表示出發；右邊直接浮在頁面上，表示抵達。
- 背景只用非常淡的環境色，不再搶人物。
- 雨具與服裝跟著人物素材一起呈現。
- 人物素材完全不使用 SVG。

## 更新方式
解壓縮 → 覆蓋既有專案 → 把 API Key 放回 `config.js` → Live Server 測試。

確認後再：
Source Control → Commit → Sync Changes

不要重新 Initialize Repository。
