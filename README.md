# tsukaima-project
使い魔プロジェクト（堰代ミコお誕生日記念企画）

## GitHub Pages (docs/)
GitHub Pages は `main` ブランチの `docs/` 配下を配信します。

## ページ構成
`docs/index.html` は特設ページ「ななし学園3年5組」です。

- キービジュアル
- 寄せ書きの紹介
- クラスの座席表

## 画像運用
ソース画像と配信用画像は分離して管理します。

- ソース画像（編集元）: `raw/images/`
- ページ表示用画像（WebP）: `docs/assets/img/`
- ダウンロード用画像（PNG）: `docs/assets/downloads/`

### 画像ファイル名規約
- `key-visual`
- `message-board`
- `seat-map`
- `profile-mico`
- `profile-tsukaima`
- `sticker-01` 〜 `sticker-18`

表示用は `.webp`、ダウンロード用（プロフィール帳のみ）は `.png` で出力します。

### 背景ステッカー演出
- 元画像は `raw/images/sticker-XX.png` で管理
- `npm run build:images` で `docs/assets/effects/stickers/sticker-XX.webp` を生成
- 背景配置は `index.html` 内JSで固定ピッチ描画（並び順のみ固定seedシャッフル）

## 開発手順
1. 依存関係をインストール
   ```bash
   npm install
   ```
2. 画像とCSSをビルド
   ```bash
   npm run build
   ```
3. `docs/index.html` をブラウザで開いて表示を確認

## 開発中に監視ビルドする場合
```bash
npm run watch:css
```

## 画像だけ再生成する場合
```bash
npm run build:images
```
