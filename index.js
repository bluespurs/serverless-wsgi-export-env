"use strict";

const BbPromise = require("bluebird");
const _ = require("lodash");

class ExportEnvWsgi {
	constructor(serverless, options) {
		this.serverless = serverless;
		this.hooks = {
			"before:wsgi:serve:serve": this.initEnv.bind(this)
		};
	}

	initEnv() {
		const AWS = this.serverless.providers.aws;

		return AWS.request("CloudFormation", "describeStacks", {
			StackName: AWS.naming.getStackName()
		})
		.then((response) => {
			const stack = response.Stacks[0];

			_.each(this.serverless.service.provider.environment, (value, key) => {
				const output = _.find(stack.Outputs, {'OutputKey': key})
				if(output) {
					this.serverless.service.provider.environment[output.OutputKey] = output.OutputValue;
				}
			});
		});
	}
}

module.exports = ExportEnvWsgi;
