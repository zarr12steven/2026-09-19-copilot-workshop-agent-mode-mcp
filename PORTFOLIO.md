# 待辦清單 Web App

這是在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以離線可運作為目標，提供日常待辦事項的新增、整理與完成管理，並透過 GitHub Copilot 的協作流程逐步完成與驗證。

## 線上展示

GitHub Pages：`https://<你的帳號>.github.io/<你的repo名稱>/`

> 請將上方網址中的帳號與 repo 名稱替換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項，輸入空白內容時不會建立項目。
- 勾選待辦事項為已完成，完成項目會顯示刪除線並淡化文字。
- 刪除單筆待辦事項。
- 顯示全部待辦事項數量，以及不受篩選影響的未完成數量。
- 清單沒有項目，或目前篩選結果為空時，顯示對應提示文字。
- 一次清除所有已完成事項；沒有已完成項目時按鈕會停用，執行前會顯示確認對話框。
- 使用「全部」、「未完成」與「已完成」篩選待辦事項，並以明顯樣式標示目前選項。
- 支援淺色與深色模式切換，並顯示對應的圖示與文字。
- 記住使用者選擇的主題；尚未手動設定時，會跟隨作業系統的 `prefers-color-scheme` 設定。
- 待辦資料與主題偏好保存於 `localStorage`，重新整理後仍可保留。
- 支援手機螢幕的響應式版面。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript 開發。
- 不使用 React、Vue、jQuery、Bootstrap、Tailwind 或其他框架與套件。
- 不依賴外部 CDN，可直接離線開啟 `index.html`。
- 待辦資料與主題偏好使用瀏覽器 `localStorage` 保存。
- 使用 CSS 變數集中管理淺色與深色主題的顏色。
- 使用 `createElement` 與 `textContent` 建立及更新 DOM 內容。

## 開發方式

- 使用 GitHub Copilot Agent Mode，從需求開始建立待辦清單的 HTML、CSS 與 JavaScript 結構，再依功能需求逐步加入深色模式、篩選與批次清除等功能。
- 透過 MCP 連接 Microsoft Learn 文件，查詢 `prefers-color-scheme` 與深色模式色彩對比等官方建議，並將結果用於檢查介面配色。
- 透過 MCP 讀取 GitHub Issues，依 issue 內容處理篩選提示與清除已完成事項等需求。
- 使用 `.github/prompts` 中的 `fix-issue` agentic workflow，遵循讀取 issue、提出計畫並確認、建立修復分支、修改、驗證、提交推送與建立 Pull Request 的流程。
- 透過瀏覽器互動測試驗證新增、篩選、主題切換、資料持久化、確認對話框與批次清除等行為。

## 我學到什麼

- 如何使用 GitHub Copilot Agent Mode 將需求拆解成可逐步驗證的前端功能。
- 如何透過 MCP 查閱 Microsoft Learn 與 GitHub Issue，讓實作與官方文件及實際需求保持一致。
- 如何使用 `localStorage` 保存使用者資料與介面偏好，讓離線網頁在重新整理後維持狀態。
- 如何以 `prefers-color-scheme`、CSS 變數與色彩對比檢查建立較完整的深色模式。
- 如何透過 agentic workflow 管理 issue、分支、驗證、commit 與 Pull Request 的完整開發流程。
