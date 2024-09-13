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

## Git環境準備
### 1. `set-url`を使用する方法
以下のコマンドで変更可能
```
git remote set-url origin {new url}
```


### 2. 手動でリモートURLを追加・削除する方法
新たなリモートURLを設定

```
git remote add origin 新規リポジトリURL
```

リモートリポジトリが追加されたか確認

```
git remote -v
```

テンプレ用のリモートURLを削除

```
git remote rm https://github.com/Fu-taKagawa/ejs-template.git
```
