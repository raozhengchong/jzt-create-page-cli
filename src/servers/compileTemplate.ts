import path       from 'path';
import * as ejs   from 'ejs';
import Metalsmith from 'metalsmith';
import Handlebars from 'handlebars';
import {IConfig}  from '../config';

export default class CompileTemplate {
	public pageName        = '';
	public config: IConfig = {};

	constructor(pageName: string, config: IConfig) {
		this.pageName = pageName;
		this.config   = config;
	}

	public init() {
		return new Promise((resolve, reject) => {
			const {template} = this.config;
			const pageName = this.pageName.trim();
			let processedPageName        = '';
			const outputPath             = this.getOutputPath(pageName);

			switch (template) {
				case 'f2e-jzt-react':
				case 'f2e-jzt-react-search-table':
					processedPageName = pageName.split('_').map((item, index) => {
						return index !== 0 ? item.trim().toLowerCase().replace(item[0], item[0].toUpperCase()) : item
					}).join('');
					break;
			}

			const replaceCnt             = {pageName: processedPageName};
			const excludeImage           = ['jpg', 'png', 'gif', 'svg', 'webp'];

			Metalsmith(path.resolve(__dirname))
				.clean(true)
				.source(path.resolve(__dirname, '../template', template || ''))
				.destination(outputPath)
				.use((files, metalsmith, done) => {
					Object.keys(files)
					      .filter(filename => {
						      const isSkip = excludeImage.find((suffix) => filename.endsWith(`.${suffix}`));
						      return !isSkip;
					      })
					      .forEach((filename) => {
						      try {
							      const contents           = files[filename].contents;
							      replaceCnt.pageName = replaceCnt.pageName.charAt(0).toUpperCase() + replaceCnt.pageName.slice(1);
							      files[filename].contents = ejs.render(contents.toString(), replaceCnt);
						      } catch (error) {
							      console.log(error);
							      return;
						      }

						      // 替换文件名
						      if (filename.indexOf('{{') !== -1) {
							      replaceCnt.pageName = replaceCnt.pageName.charAt(0).toLowerCase() + replaceCnt.pageName.slice(1);
							      const replacedFilename = Handlebars.compile(filename)(replaceCnt);
							      if (replacedFilename in files) {
								      throw new Error('pageName参数与template目录中文件名重合度过高。');
							      }
							      files[replacedFilename] = files[filename];
							      delete files[filename];
						      }

					      });
					done(null, files, metalsmith);
				})
				.build((error) => {
					resolve(outputPath);
					error ? reject(error) : resolve('success');
				});
		});
	}

	public getOutputPath(pageName: string): string {
		const defaultOutput = '/views';
		const output = this.config.output;
		return path.resolve(
			process.cwd(),
			output || defaultOutput,
			pageName
		);
	}
}
