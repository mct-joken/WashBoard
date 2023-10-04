<div align="center">
  <img src="public/washboard-app-banner.png" style="width:100%;">
  <p style="font-weight:600;margin:1rem;">WashBoardは、学生寮での洗濯に関する問題をスマートに解決するアプリです。</p>
</div>

# Washboard

## 開発

### 必要なもの

- [Node.js](https://nodejs.org/en)
  - LTSをインストール

### 実行

| ⚠️ 初回のみパッケージのインストールが必要 ⚠️ |
| :----------------------------------------------: |
|                  `pnpm install`                  |

プロジェクトのルートで
```sh
pnpm dev
```
を実行

ビルドに成功したらブラウザで[http://localhost:8788](http://localhost:8788)を開く

## 動作環境

- Windows
  - Chrome推奨
  - Firefox, Edgeでの動作を確認
- Mac
  - Safariでの動作を確認
- Android
  - Chrome推奨
- iOS
  - Safari**必須**
  - PWA**必須**

## ドキュメント

- [Remix Docs](https://remix.run/docs)
- [FCM REST API](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages?authuser=0&hl=ja)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)