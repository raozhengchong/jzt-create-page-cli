/***
 * @template template目录中的模版
 * @output 输出目录的相对路径
 * ***/

export interface IConfig {
	template?: string;
	output?: string;
}

export const defaultConfig = {
	template  : 'f2e-jzt-react',
	output    : 'views'
};
