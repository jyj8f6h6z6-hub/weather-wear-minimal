# 今天怎麼穿？ v4

這是可直接用 VS Code + GitHub Pages 的完整網站。

## v4 這次修正

- 「去哪？」頁面只剩 **一個 Google Places 搜尋框**。
- 移除舊的白色備援搜尋框、右箭頭與「找不到」流程。
- 強制 Google 搜尋元件使用淺色模式，避免出現黑色搜尋框。
- 點 Google 候選地點後，直接查目的地天氣並進入穿搭結果。
- 若 Google Places 真的載入失敗，只會顯示「Google 地點搜尋未載入」。

## API Key

請打開 `config.js`，把自己的 Key 放入：

```js
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: '你的 API Key'
};
```

Google Cloud 需啟用：

- Maps JavaScript API
- Places API (New)

正式上 GitHub Pages 時，請限制 API Key 的網站來源，例如：

`https://jyj8f6h6z6-hub.github.io/*`

本機 Live Server 若也有限制來源，可另外允許：

`http://127.0.0.1:*/*`
`http://localhost:*/*`

## VS Code 更新既有 GitHub 專案

如果你已經建立 Repository，**不要重新 Initialize、不要重新 Publish**。

1. 把 v4 ZIP 解壓縮。
2. 用 v4 檔案覆蓋原專案裡的同名檔案。
3. `config.js` 再貼回你的 API Key。
4. Live Server 先測試。
5. 正常後：Source Control → Commit → Sync Changes。
6. GitHub Pages 更新後，瀏覽器按 `Ctrl + F5`。
