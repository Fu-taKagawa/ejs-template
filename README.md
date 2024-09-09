## 構築

### 手順1

npmのインストールコマンドで必要なパッケージをインストール  

```
npm ci
```

### 手順2
デフォルトではmain.jsが作成されていないため、src内のJSファイルをコンパイルするために以下コマンドを実行。

```
npm run build:webpack
```

### 手順3
localhostの起動

```
npm start
```

通常`localhost:8000`が起動し、src内のファイル修正で対象となるdist内の各ファイルが自動的に更新される。  
（ポートが埋まっている場合は`webpack.config.js`ファイルの`port`を更新）
