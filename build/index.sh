rm -r dist views
tsc -p .
cp -r src/template dist/src/template
cp -r src/answer.tql.ejs dist/src/answer.tql.ejs
cp package.json dist/package.json
