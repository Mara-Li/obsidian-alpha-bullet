import * as path from "node:path";
import { ReportAggregator } from "wdio-html-nice-reporter";
import * as os from "node:os";
import dotenv from "dotenv";
import {
	obsidianBetaAvailable,
	resolveObsidianVersions,
} from "wdio-obsidian-service";
import stripAnsi from "strip-ansi";
import fs from "node:fs";
const cacheDir = path.resolve(os.tmpdir(), ".obsidian-cache");
dotenv.config();

console.log(`Using obsidian vault: ${process.env.VAULT_TEST}`);
console.log(`Using obsidian cache dir: ${cacheDir}`);

let versions: [string, string][]; // [appVersion, installerVersion][]
if (process.env.OBSIDIAN_VERSIONS) {
	// Space separated list of appVersion/installerVersion, e.g. "1.7.7/latest latest/earliest"
	versions = process.env.OBSIDIAN_VERSIONS.split(/[ ,]+/).map((v) => {
		const [app, installer = "earliest"] = v.split("/"); // default to earliest installer
		return [app, installer];
	});
} else if (process.env.CI) {
	// Running in GitHub CI. You can use RUNNER_OS to select different versions on different
	// platforms in the workflow matrix if you want
	versions = [["latest", "latest"]];
	if (await obsidianBetaAvailable(cacheDir)) {
		versions.push(["latest-beta", "latest"]);
	}

	// Print the resolved Obsidian versions to use as the workflow cache key
	// (see .github/workflows/test.yaml)
	for (let [app, installer] of versions) {
		[app, installer] = await resolveObsidianVersions(app, installer, cacheDir);
		console.log(`${app}/${installer}`);
	}
} else {
	versions = [["latest", "latest"]];
}
let reportAggregator: ReportAggregator;
export const config: WebdriverIO.Config = {
	runner: "local",

	specs: ["./tests/specs/**/*.e2e.ts"],

	// How many instances of Obsidian should be launched in parallel during testing.
	maxInstances: Number(process.env["WDIO_MAX_INSTANCES"] || 4),

	capabilities: versions.map(([appVersion, installerVersion]) => ({
		browserName: "obsidian",
		browserVersion: appVersion,
		"wdio:obsidianOptions": {
			installerVersion: installerVersion,
			plugins: ["./dist"],
			// If you need to switch between multiple vaults, you can omit this and use
			// `reloadObsidian` to open vaults during the test.
			vault: process.env.VAULT_TEST,
		},
	})),

	framework: "mocha",
	services: ["obsidian"],
	// You can use any wdio reporter, but by default they show the chromium version instead of the Obsidian version a
	// test is running on. obsidian-reporter is just a wrapper around spec-reporter that shows the Obsidian version.

	mochaOpts: {
		ui: "bdd",
		timeout: 60000,
		// You can set more config here like "retry" to retry flaky tests
		// or "bail" to quit tests after the first failure.
	},

	waitforInterval: 250,
	waitforTimeout: 5 * 1000,

	cacheDir: cacheDir,

	logLevel: "warn",
	reporters: [
		"obsidian",
		[
			"html-nice",
			{
				debug: false,
				outputDir: "./reports/html-reports/",
				filename: "report.html",
				reportTitle: "Web Test Report",
				useOnAfterCommandForScreenshot: false,
				linkScreenshots: true,
				showInBrowser: true,
				theme: "dark",
				produceJson: true,
				produceHtml: true,
				removeOutput: true,
				plugins: ["wdio-html-nice-reporter", "wdio-obsidian-reporter"],
			},
		],
	],
	afterTest: function (test, context, { error }) {
		if (error) {
			if (typeof error.message === "string") {
				error.message = stripAnsi(error.message);
			}
			if (typeof error.stack === "string") {
				error.stack = stripAnsi(error.stack);
			}

			for (const key of Object.keys(error)) {
				const value = (error as any)[key];
				if (typeof value === "string") {
					(error as any)[key] = stripAnsi(value);
				}
			}
		}
	},
	onPrepare: function () {
		reportAggregator = new ReportAggregator({
			outputDir: "./reports/html-reports/",
			filename: "report.html",
			reportTitle: "Web Test Report",
			browserName: "obsidian",
			collapseTests: false,
			showInBrowser: true,
			removeOutput: true,
			produceJson: false,
		});
		reportAggregator.clean(); // remove old reports
	},
	onComplete: async function () {
		await reportAggregator.createReport();
		const files = fs.readdirSync("./reports/html-reports/");
		for (const file of files) {
			if (file.endsWith(".json")) {
				fs.unlinkSync(path.join("./reports/html-reports/", file));
			}
			if (file.endsWith(".html") && file !== "report.html") {
				fs.unlinkSync(path.join("./reports/html-reports/", file));
			}
		}
	},
};
