"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validOptions = [
    "configFile",
    "extensions",
    "baseUrl",
    "silent",
    "logLevel",
    "logInfoToStdOut",
    "context",
    "colors"
];
/**
 * Takes raw options from the webpack config,
 * validates them and adds defaults for missing options
 */
function getOptions(rawOptions) {
    validateOptions(rawOptions);
    const options = makeOptions(rawOptions);
    return options;
}
exports.getOptions = getOptions;
/**
 * Validate the supplied loader options.
 * At present this validates the option names only; in future we may look at validating the values too
 * @param rawOptions
 */
function validateOptions(rawOptions) {
    const loaderOptionKeys = Object.keys(rawOptions);
    for (let i = 0; i < loaderOptionKeys.length; i++) {
        const option = loaderOptionKeys[i];
        const isUnexpectedOption = validOptions.indexOf(option) === -1;
        if (isUnexpectedOption) {
            throw new Error(`tsconfig-paths-webpack-plugin was supplied with an unexpected loader option: ${option}
Please take a look at the options you are supplying; the following are valid options:
${validOptions.join(" / ")}
`);
        }
    }
}
const configFileDefault = "tsconfig.json";
const pth = require("path");
const proc = require("process");
function makeOptions(rawOptions) {
    const options = Object.assign({}, {
        configFile: configFileDefault,
        extensions: [".ts", ".tsx"],
        baseUrl: undefined,
        silent: false,
        logLevel: "WARN",
        logInfoToStdOut: false,
        context: undefined,
        colors: true
    }, rawOptions);
    let options1 = options;
    //litle to dirty hack to make things work well with ts-loader
    if (options1.configFile !== configFileDefault) {
        //compute the absolute path name
        const flPth = pth.resolve(options.configFile);
        //filename with extension
        const flNm = pth.win32.basename(flPth);
        //set the filename and extension to the special env variable
        proc.env.TS_NODE_PROJECT = flNm;
        options1 = Object.assign({}, options, { 
            // set the confile to the path containing the file name
            configFile: pth.dirname(flPth) });
    }
    const options2 = Object.assign({}, options1, { logLevel: options.logLevel.toUpperCase() });
    return options2;
}
