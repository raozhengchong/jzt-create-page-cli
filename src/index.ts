#!/usr/bin/env node
import ora                      from 'ora';
import program                  from 'commander';
import {defaultConfig, IConfig} from './config';
import Question                 from './servers/question';
import CompileTemplate          from './servers/compileTemplate';

program
	.option('-t --template [type]', '选择模版')
	.option('-o --output [type]', '输出目录')
	.command('create <pageName>')
	.description('创建一个新的页面')
	.action(async (pageName: string) => {
		const {template, output} = program.opts();
		const config: IConfig                = {
			...defaultConfig,
			template  : template || defaultConfig.template,
			output    : output || defaultConfig.output
		};

		// 问答交互
		const spinner        = ora();
		const question       = new Question();
		const choiceTemplate = await question.choiceTemplate();
		if (!choiceTemplate) {
			spinner.text = '该模版不存在，请选择可用模版';
			spinner.fail();
			return;
		}

		config.template = choiceTemplate.templateName;
		const answers   = await question.answer(config);
		if (!answers) return;

		// 创建页面
		const compileTemplate = new CompileTemplate(pageName, config);
		spinner.text          = '正在创建...\n';
		spinner.start();
		compileTemplate.init().then((newPagePath) => {
			spinner.text = `创建成功,请查看该目录：${newPagePath}`;
			spinner.succeed();
		}).catch((error) => {
			spinner.text = '创建失败,请重试!';
			spinner.fail();
			console.error(error);
		});

	})
program.parse(process.argv)
