export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface Options {
  readonly configFile: string;
  readonly extensions: ReadonlyArray<string>;
  readonly baseUrl: string;
  readonly silent: boolean;
  readonly logLevel: LogLevel;
  readonly logInfoToStdOut: boolean;
  readonly context: string;
  readonly colors: boolean;
}

type ValidOptions = keyof Options;
const validOptions: ReadonlyArray<ValidOptions> = [
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
export function getOptions(rawOptions: {}): Options {
  validateOptions(rawOptions);

  const options = makeOptions(rawOptions);
  return options;
}

/**
 * Validate the supplied loader options.
 * At present this validates the option names only; in future we may look at validating the values too
 * @param rawOptions
 */
function validateOptions(rawOptions: {}): void {
  const loaderOptionKeys = Object.keys(rawOptions);
  for (let i = 0; i < loaderOptionKeys.length; i++) {
    const option = loaderOptionKeys[i];
    const isUnexpectedOption =
      (validOptions as ReadonlyArray<string>).indexOf(option) === -1;
    if (isUnexpectedOption) {
      throw new Error(`tsconfig-paths-webpack-plugin was supplied with an unexpected loader option: ${option}
Please take a look at the options you are supplying; the following are valid options:
${validOptions.join(" / ")}
`);
    }
  }
}

const configFileDefault = "tsconfig.json";

import * as pth from "path";
import * as proc from "process";

function makeOptions(rawOptions: Partial<Options>): Options {
  const options: Options = {
    ...({
      configFile: configFileDefault,
      extensions: [".ts", ".tsx"],
      baseUrl: undefined,
      silent: false,
      logLevel: "WARN",
      logInfoToStdOut: false,
      context: undefined,
      colors: true
    } as Options),
    ...rawOptions
  };

  let options1: Options = options;

  //litle to dirty hack to make things work well with ts-loader
  if (options1.configFile !== configFileDefault) {
    //compute the absolute path name
    const flPth = pth.resolve(options.configFile);
    //filename with extension
    const flNm =  pth.win32.basename(flPth);
    //set the filename and extension to the special env variable
    proc.env.TS_NODE_PROJECT = flNm;

    options1 = {
      ...options,
      // set the confile to the path containing the file name
      configFile: pth.dirname(flPth)
    };
  }

  const options2: Options = {
    ...options1,
    logLevel: options.logLevel.toUpperCase() as LogLevel
  };

  return options2;
}
