# File Getter

コマンド1つで指定したページのファイルを漁ってダウンロードしてくれる優れモノ

## install

```
npm i
```

## usage

```
node index.js -u https://example.html -e pdf,zip
```

## options

### -u, --url

対象のURL

### -e, --extension

対象の拡張子（拡張子の後にカンマ（,）を付けることで複数指定可能）

### -s, --selector

対象の要素をCSSセレクターで指定（指定しない場合は`html`になります。）