# tsukaima-project
使い魔プロジェクト（堰代ミコお誕生日記念企画）

## GitHub Pages (docs/)
GitHub Pages は `main` ブランチの `docs/` 配下を配信します。

## Tailwind CSS の最小確認手順
1. 依存関係をインストール
   ```bash
   npm install
   ```
2. CSS をビルド
   ```bash
   npm run build:css
   ```
3. `docs/index.html` をブラウザで開いて、`Hello World` の表示を確認

## 開発中に監視ビルドする場合
```bash
npm run watch:css
```
