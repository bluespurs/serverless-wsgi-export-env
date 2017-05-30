"use strict";

const ExportEnv = require('serverless-export-env');
const BbPromise = require("bluebird");

class ExportEnvWsgi {
	constructor(serverless, options) {
		this.exportEnv = new ExportEnv(serverless, options);
		this.serverless = serverless;
		this.hooks = {
			"before:wsgi:serve:serve": this.initEnv.bind(this)
		};
	}

	initEnv() {
		return this.exportEnv.initOfflineHook()
			.then(this.exportEnv.collectEnvVars.bind(this.exportEnv))
			.then(this.exportEnv.resolveEnvVars.bind(this.exportEnv))
			.then(this.exportEnv.applyEnvVars.bind(this.exportEnv));
	}
}

module.exports = ExportEnvWsgi;
