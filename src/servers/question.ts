import fs        from 'fs';
import path      from 'path';
import * as ejs  from 'ejs';
import inquirer  from 'inquirer';
import {IConfig} from '../config';

const resolve = (paths: string) => {
	const projectPath = path.join(__dirname, '..');
	return path.resolve(projectPath, paths);
};

export default class Question {
	public confirm(message: string, name: string) {
		return inquirer.prompt({
			type  : 'confirm',
			name,
			message,
			prefix: ''
		});
	}

	async answer(config: IConfig) {
		let templateStr = '';
		try {
			templateStr = fs.readFileSync(resolve('answer.tql.ejs')).toString();
		} catch (e) {
			console.log('error: ', e);
			return false;
		}
		const templateCnt = ejs.render(templateStr, config);
		const confirm     = await this.confirm(templateCnt, 'config');
		return confirm.config;
	}

	public choiceTemplate() {
		let templateList = [];
		try {
			templateList = fs.readdirSync(resolve('template'));
		} catch (e) {
			console.log('error: ', e);
			return false;
		}
		return inquirer.prompt([
			{
				type   : 'list',
				name   : 'templateName',
				message: 'select template',
				choices: templateList
			}
		]);
	}
}
