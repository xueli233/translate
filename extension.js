const vscode = require('vscode');
const translation_api_1 = require("translation-api");
const translationEngine = 'youdao';
const change_case_1 = require("change-case");


function activate(context) {
    // var srcText = ['我的','你的','他的'];
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
        return __awaiter(this, void 0, void 0, function*() {
            var type = yield Select();
            for (const iterator of textArr) {
                if (iterator) {
                    const lang = yield determineLanguage(iterator, engine);
                    let res = yield translate(engine, iterator, lang);
                    let result = change_case_1[type](res.result[0] || res.result)
                    str += `${res.text} ${result}\n`;
                }
            }
            editor.edit((builder) => builder.replace(selection, str));
        });
    } catch (error) {

    }
    let disposable = vscode.commands.registerCommand('demo.helloWorld', function() {
        vscode.window.showInformationMessage('Hello World from demo!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
/**
 * 用户选择选择转换形式
 * @param word 需要转换的单词
 * @return  用户选择
 */
function Select() {
    return __awaiter(this, void 0, void 0, function*() {
        var items = [];
        var opts = { matchOnDescription: true, placeHolder: 'choose replace 选择替换' };
        items.push({ label: 'snakeCase', description: 'snakeCase 下划线' });
        items.push({ label: 'camelCase', description: 'camelCase 小驼峰' });
        items.push({ label: 'pascalCase', description: 'pascalCase 大驼峰' });

        // items.push({ label: change_case_1.paramCase(word), description: 'paramCase 中划线' });
        // items.push({ label: change_case_1.constantCase(word), description: 'constantCase 常量' });
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
    return __awaiter(this, void 0, void 0, function*() {
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
    return __awaiter(this, void 0, void 0, function*() {
        if (translationEngine === 'google') {
            return engine.translate({ text: srcText, from: lang, to: 'en', com: true });
        }
        return engine.translate({ text: srcText, from: lang, to: 'en' });
    });
}

var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : new P(function(resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    activate,
    deactivate
}