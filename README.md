# 今天怎麼穿？ v3

極簡穿搭天氣網站。這版重點修正 Google Maps / Places 目的地搜尋。

## v3 主要修正

- 使用 Google Maps JavaScript API + Places API (New)
- 目的地改為 Google `PlaceAutocompleteElement`
- 輸入時直接顯示 Google 地點候選，不必按右箭頭
- 優先搜尋台灣，並以目前 GPS 位置作為搜尋偏向
- 選到地點後直接取得座標並進入目的地天氣／穿搭結果
- 加強 GitHub Pages 首次載入時的等待與錯誤處理
- Google API 若載入失敗，不再把問題顯示成「找不到地點」

## 你的 API Key

請打開 `config.js`：

```js
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: '你的 API Key'
};
```

如果你從 v2 整包覆蓋，記得把你原本的 Key 再貼回 `config.js`。

Google Cloud 請確認：

1. Billing 已啟用
2. Maps JavaScript API 已啟用
3. Places API (New) 已啟用
4. API Key 的 Website restrictions 有包含你的 GitHub Pages 網址
5. API restrictions 允許 Maps JavaScript API 與 Places API (New)

網站限制可使用：

`https://jyj8f6h6z6-hub.github.io/*`

## VS Code 更新到原本 GitHub

這不是新 Repository。把 v3 檔案覆蓋原本專案後：

1. VS Code 左側 Source Control
2. 確認變更檔案
3. Commit（例如：`fix google places search v3`）
4. Sync Changes
5. 等 GitHub Pages 約 1～3 分鐘
6. 網頁按 `Ctrl + F5` 強制重新整理

### 最重要

不要再次 Initialize Repository，也不要再次 Publish Branch。

## 若仍看到「Google 地點搜尋未載入」

代表不是「搜尋不到台北市文山區」，而是 Google API 本身沒有成功載入。此時按 F12 → Console，通常可以直接看到 Google 回傳的原因，例如 API 未啟用、Billing、Referer 限制或 API restriction。
