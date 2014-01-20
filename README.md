Jassa-Angular-UI
================

Angular-JS based user interface components for Jassa


    sudo npm install -g generator-angularjs-library
    # glob module is a missing dep
    sudo npm install -i glob
    sudo npm install -i lodash
    sudo npm install -i debug
    sudo npm install -i async
    sudo npm install -i diff
    sudo npm install -i inquirer
    sudo npm install -i isbinaryfile
    sudo npm install -i mkdirp
    sudo npm install -i rimraf
    sudo npm install -i iconv-lite
    sudo npm install -i tar
    sudo npm install -i request
	sudo npm install -i dargs
	sudo npm install -i underscore.string
	sudo npm install -i cheerio
	sudo npm install -g shelljs

sudo vim /usr/lib/node_modules/generator-angularjs-library/node_modules/yeoman-generator/lib/util/common.js
Change content to module.exports.yeoman = 'yeoman' (https://github.com/jvandemo/generator-angularjs-library/issues/10) 

    yo install angularjs-library

	Clean up the project if you configured the generator wrong:
	rm -rf bower_components bower.json Gruntfile.js karma-unit.conf.js node_modules package.json src test
