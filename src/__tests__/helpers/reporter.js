import { SpecReporter } from 'jasmine-spec-reporter';
import { JUnitXmlReporter } from 'jasmine-reporters';

jasmine.getEnv().clearReporters();

jasmine.getEnv().addReporter(
	new SpecReporter({
		spec: {
			displayPending: true,
		},
		summary: {
			displayFailed: true,
		},
	})
);

jasmine.getEnv().addReporter(
	new JUnitXmlReporter({
		consolidateAll: true,
		savePath: 'results',
		filePrefix: 'results',
	})
);
