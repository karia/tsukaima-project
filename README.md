# tsukaima-project
使い魔プロジェクト（堰代ミコお誕生日記念企画）

## GitHub Pages (docs/)
GitHub Pages は `main` ブランチの `docs/` 配下を配信します。

## ページ構成
`docs/index.html` は特設ページ「ななし学園3年5組」です。

- キービジュアル
- 寄せ書きの紹介
- クラスの座席表

## 画像配置
以下の画像を `docs/assets/img/` に配置して利用します。

- `key-visual.png`
- `message-board.png`
- `seat-map.png`

## 開発手順
1. 依存関係をインストール
   ```bash
   npm install
   ```
2. CSS をビルド
   ```bash
   npm run build:css
   ```
3. `docs/index.html` をブラウザで開いて表示を確認

## 開発中に監視ビルドする場合
```bash
npm run watch:css
```
