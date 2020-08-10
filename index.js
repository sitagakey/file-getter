const fs = require('fs');
const request = require('request');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const DIR_NAME = './files';
const arg = require('commander');

arg
.version('1.1.0')
.option('-u, --url <1>', 'Target URL')
.option('-s, --selector <1>', 'CSS Selector', 'html')
.option('-e, --extension <items>', 'File Extensions', (items) => {
    return items.split(',');
})
.parse(process.argv);

/**
 * 指定したディレクトリ内にあるファイルを全て削除する
 * @param {String} dirName ディレクトリ名
 */
const fileRemoveOf = async (dirName) => {
    const dirFile = fs.readdirSync(dirName);

    dirFile.forEach((path) => {
        fs.unlinkSync(`${dirName}/${path}`);
    });
};
/**
 * 指定したURLをブラウザーで開く
 * @param {String} url 開きたいサイトのURL
 */
const goTo = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage(url);

    await page.goto(url);

    return {browser: browser, page: page};
};
/**
 * PDFリンクを取得する
 * @param {Object} page pageObject
 * @param {String} selector PDFリンクの検索対象要素をCSSセレクタで指定（なにも指定されていなければ html になる）
 */
const getFileLink = (page, selector, extension) => {
    return page.evaluate((selector, extension) => {
        const arr = [];
        
        extension.forEach((ext) => {
            const content = document.querySelector(selector);
            const a = content.querySelectorAll(`a[href$=".${ext}"]`);
            let len = a.length;
            
            for (;len--;) {
                arr.unshift(a[len].href);
            }
        });

        return arr;
    }, selector, extension);
};
/**
 * リンクを元にPDFを出力
 * @param {Array} links PDFのリンクが格納されている配列
 * @param {String} dirName 出力先
 */
const output = async (links, dirName) => {
    links.forEach((url) => {
        const paths = url.split('/');
        const name = `${dirName}/${paths[paths.length - 1]}`;

        request(url).pipe(fs.createWriteStream(name));
    });
};

if (arg.url) {
    fileRemoveOf(DIR_NAME).then(() => {
        goTo(arg.url).then((pageData) => {
            const {browser, page} = pageData;

            getFileLink(page, arg.selector, arg.extension).then((links) => output(links, DIR_NAME).then(() => browser.close().then(() => console.log(chalk.green(`SUCCESS!! Look at ${DIR_NAME} Directory.`)))));
        });
    });
} else {
    console.error(chalk.red('Please URL specific. (e.g., node index.js -u https://example.html)'));
}