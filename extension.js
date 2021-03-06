// "use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const translation_api_1 = require("translation-api");
const change_case_1 = require("change-case");
const py = require('./PinYinTranslate');
let translationEngine = 'google';
function activate(context) {
    const disposable = vscode_1.commands.registerCommand('extension.varTranslation', vscodeTranslate);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function vscodeTranslate() {
    return __awaiter(this, void 0, void 0, function* () {
        const CONFIG = vscode_1.workspace.getConfiguration('varTranslation');
        translationEngine = CONFIG.translationEngine;
        //获取编辑器
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        //获取文字
        const selection = editor.selection;
        let srcText = editor.document.getText(selection);

        // arr.forEach(item => {
        //     str += item + '====';
        // })
        vscode_1.window.showInformationMessage(str);
        if (!srcText) {
            return;
        }
        try {
            const engine = getTheTranslationEngine();
            if (translationEngine === 'pinyin') {
                var arr = srcText.split(/[\n\s]/);
                var str = '';
                arr.forEach(item=>{
                    if(item){
                        str += `\n${item} ${py.chineseToPinYin(item)}`
                    }
                })
                    editor.edit((builder) =>{
                        builder.replace(selection, str );
                    });
                return;
            }else if(translationEngine === 'AllToEn'){

            };

            const lang = yield determineLanguage(srcText, engine);

            var arr = srcText.split(/[\n\s]/);
            var str = '';
            arr.forEach(item=>{
                if(item){

                const translationResult = yield translate(engine, srcText, lang);

                if (translationResult && translationResult.result) {
                    // srcText = translationResult.result[0];
                }
// yield Select(item).then(s=>{

//                     str += `${item} ${ s}--------`
// })
                    // str += `${item} ${ yield Select(item)}--------`
                    // str = `${item} ${yield Select(item)} \n`
                    // editor.edit((builder) =>{ builder.insert(builder.setEndOfLine(2), str ); });
                }
            })

		vscode_1.window.showInformationMessage(str);
            // editor.edit((builder) => builder.replace(selection, srcText + ' ' + str));
            return;
            // //非英语需要翻译
            // if (lang !== 'en') {
            //     const translationResult = yield translate(engine, srcText, lang);
            //     if (translationResult && translationResult.result) {
            //         srcText = translationResult.result[0];
            //     }
            // }
            // const result = yield Select(srcText);

            if (!result) {
                return;
            }
            //替换文案
            // editor.edit((builder) => builder.replace(selection, srcText + ' ' + result));
        }
        catch (err) {
            vscode_1.window.showInformationMessage(`出错了设置切换一下引擎,当前的引擎是${translationEngine}`);
        }
    });
}
/**
 * 用户选择选择转换形式
 * @param word 需要转换的单词
 * @return  用户选择
 */
function Select(word) {
    return __awaiter(this, void 0, void 0, function* () {
        var items = [];
        var opts = { matchOnDescription: true, placeHolder: 'choose replace 选择替换' };
        items.push({ label: change_case_1.camelCase(word), description: 'camelCase 小驼峰' });
        items.push({ label: change_case_1.pascalCase(word), description: 'pascalCase 大驼峰' });
        items.push({ label: change_case_1.snakeCase(word), description: 'snakeCase 下划线' });
        items.push({ label: change_case_1.paramCase(word), description: 'paramCase 中划线' });
        items.push({ label: change_case_1.constantCase(word), description: 'constantCase 常量' });
        const selections = yield vscode_1.window.showQuickPick(items, opts);
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
        }
        else if (translationEngine === 'google') {
            lang = yield engine.detect({ text: srcText, com: true });
        }
        else {
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
//# sourceMappingURL=extension.js.map