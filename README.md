# PDF Getter

コマンド1つで指定したページのPDFを漁ってダウンロードしてくれる優れモノ

## install

```
npm i
```

## usage

```
node index.js 適当なURL [CSSセレクター]
```

CSSセレクターを指定すると、指定した要素の中からPDFリンクを検索します。指定しない場合は`html`になります。