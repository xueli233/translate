const vscode = require('vscode');
const translation_api_1 = require("translation-api");
const translationEngine = 'youdao';
const change_case_1 = require("change-case");
var request = require('request');

function activate(context) {
    let disposable = vscode.commands.registerCommand('demo.helloWorld', vscodeMain);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function vscodeMain() {
    request('https://11197714-26a6-4130-9f04-bfa59cd9421a.bspapp.com/http/getFieldValue', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var list = JSON.parse(body).data;
            handle(list)
        }
    });
}
function handle(list) {
    // 获取文本信息
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    //获取文字
    const selection = editor.selection;
    let srcText = editor.document.getText(selection);
    let textArr = srcText.split(/[\s\r\n]/g);

    try {
        const engine = getTheTranslationEngine();
        var str = '';
        var codeStr = '';
        return __awaiter(this, void 0, void 0, function* () {
            var type = yield Select();

            for (const iterator of textArr) {
                if (iterator) {
                    // 当前语言
                    const lang = yield determineLanguage(iterator, engine);
                    let [key, value] = iterator.split(/[\:\：]/);
                    let valueType = typeof eval(`${value}`);
                    //判断是否为浮点型
                    if (valueType === 'number' && /^-?\d*\.\d+$/.test(eval(`${value}`))) valueType = 'float';
                    // 翻译结果
                    let item = list.find(i => i.field === key);
                    let result = '';
                    if (item) {
                        result = item.value;
                    } else {
                        let res = yield translate(engine, key, lang);
                        result = change_case_1[type](res.result[0] || res.result)
                    }
                    codeStr += `${result}:${value}, //${key}\n`;
                    str += `|${result}|${valueType}|${key} |\n`;
                }
            }
            var doc = `
**简要描述：** 

**请求URL：** 
- \` http://xx.com/api/article/detail \`

**请求方式：**
- POST 

**参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |

**返回示例**
\`\`\`
{
"code": 1,
"msg":"提示信息"
"data": {
    ${codeStr}
}
}
\`\`\`

**返回参数说明** 

|参数名|类型|说明|
|:-----  |:-----|-----                           |
${str}
**备注** 
            `;
            editor.edit((builder) => builder.replace(selection, doc));
        });
    } catch (e) {
        vscode.window.showInformationMessage(JSON.stringify(e));
    }
}

function deactivate() { }
/**
 * 用户选择选择转换形式
 * @param word 需要转换的单词
 * @return  用户选择
 */
function Select() {
    return __awaiter(this, void 0, void 0, function* () {
        var items = [];
        var opts = { matchOnDescription: true, placeHolder: 'choose replace 选择替换' };
        items.push({ label: 'snakeCase', description: 'snakeCase 下划线' });
        items.push({ label: 'camelCase', description: 'camelCase 小驼峰' });
        items.push({ label: 'pascalCase', description: 'pascalCase 大驼峰' });
        const selections = yield vscode.window.showQuickPick(items, opts);
        if (!selections) {
            return;
        }

        return selections.label;
    });
}
/**
 * 获取翻译引擎配置
 * @return 引擎
 */
function getTheTranslationEngine() {
    let engine = translation_api_1.google;
    if (translationEngine === 'google') {
        engine = translation_api_1.google;
    }
    if (translationEngine === 'youdao') {
        engine = translation_api_1.youdao;
    }
    if (translationEngine === 'baidu') {
        engine = translation_api_1.baidu;
    }
    return engine;
}
/**
 * 判断目标语言
 */
function determineLanguage(srcText, engine) {
    return __awaiter(this, void 0, void 0, function* () {
        let lang;
        //正则快速判断英文
        if (/^[a-zA-Z\d\s\-\_]+$/.test(srcText)) {
            lang = 'en';
        } else if (translationEngine === 'google') {
            lang = yield engine.detect({ text: srcText, com: true });
        } else {
            lang = yield engine.detect(srcText);
        }
        return lang;
    });
}

function translate(engine, srcText, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        if (translationEngine === 'google') {
            return engine.translate({ text: srcText, from: lang, to: 'en', com: true });
        }
        return engine.translate({ text: srcText, from: lang, to: 'en' });
    });
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    activate,
    deactivate
}