# 今天怎麼穿？ v5

這版重點是「結果頁美化」，功能沿用 v4：定位、附近、Google Places 目的地搜尋、天氣與穿搭判斷。

## v5 視覺調整
- 人物放大，成為結果頁主角。
- 左邊「現在」人物保留往右走的姿態；右邊是抵達後站定。
- 天氣改成淡化的場景背景，不再像獨立 icon 卡片。
- 現在／抵達資訊縮小，讓視線先看到人物穿著。
- 路線與箭頭淡化，保留「從左走到右」的感覺。
- 配件建議改成小型半透明標籤。
- ETA、重選都降為次要資訊。
- 桌機仍維持手機 App 卡片，但比例與留白重新整理。

## 更新既有 GitHub 專案
1. 解壓縮 ZIP。
2. 用 v5 檔案覆蓋你目前 VS Code 專案中的同名檔案。
3. **config.js 請保留／重新貼入你自己的 Google Maps API Key。**
4. Live Server 測試。
5. VS Code 左側 Source Control → Commit → Sync Changes。

不要重新 Initialize Repository，也不用重新 Publish Branch。
