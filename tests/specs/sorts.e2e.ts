/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import { obsidianPage } from "wdio-obsidian-service";
import {
	expecteds,
	generatedFm,
	getExpectedKey,
	manifest,
	stringifyFrontmatter,
	type Options,
} from "./helper";
import { ECommands } from "../../src/interfaces";
import type { Expectation } from "../fixtures";
import path from "path";
import fs from "fs";
import type SortMarkdownList from "../../src/main";

console.log(`Running tests for ${manifest.name} v${manifest.version}`);

const folder = path.resolve(__dirname, "..");
const fixtures = path.resolve(folder, "fixtures");

export async function createFixture(
	fixtureName: string,
	frontmatter?: Options,
) {
	const fixtureContent = fs.readFileSync(
		path.join(fixtures, fixtureName),
		"utf-8",
	);
	const frontmatterContent = stringifyFrontmatter(frontmatter);
	await browser.executeObsidian(
		async ({ app }, content, fileName, fm) => {
			if (fm) content = `${fm}${content}`;
			await app.vault.create(fileName, content);
		},
		fixtureContent,
		fixtureName,
		frontmatterContent,
	);

	await obsidianPage.openFile(fixtureName);
	const fileOpened = await browser.executeObsidian(({ app, obsidian }) => {
		const leaf = app.workspace.getActiveViewOfType(obsidian.MarkdownView)?.leaf;
		if (leaf?.view instanceof obsidian.MarkdownView) {
			return leaf.view.file?.path;
		}
		return null;
	});

	expect(fileOpened).toBe(fixtureName);
}

export async function runTestWithFixture(
	fixtureName: string,
	command: ECommands,
	frontmatter?: Options,
) {
	await createFixture(fixtureName, frontmatter);
	await browser.executeObsidianCommand(`${manifest.id}:${command}`);

	//return updated content
	return await browser.executeObsidian(async ({ app, obsidian }, fileName) => {
		const file = app.vault.getAbstractFileByPath(fileName);
		if (file && file instanceof obsidian.TFile) {
			return await app.vault.read(file);
		}
		return "";
	}, fixtureName);
}

describe("No frontmatter sort", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
		//set the default value for the settings
		const plug = await browser.executeObsidian(
			async ({ app }, manifest: Record<string, string>) => {
				const plugin = app.plugins.getPlugin(manifest.id) as SortMarkdownList;
				if (plugin) {
					plugin.settings.sml_level = 2;
					await plugin.saveSettings();
					return plugin;
				}
				return null;
			},
			manifest,
		);
		expect(plug).not.toBeNull();
		expect(plug?.settings.sml_level).toBe(2);
	});
	for (const item of expecteds) {
		describe(item.fileName, () => {
			it("sort alphabetical", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(
					item.fileName,
					ECommands.Ascending,
				);
				expect(result).toBe(expectedFm.alpha);
			});
			it("sort alphabetical with title", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(
					item.fileName,
					ECommands.AdvancedAsc,
				);
				expect(result).toBe(expectedFm.withTitle);
			});
			it("sort alphabetical (reverse)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(
					item.fileName,
					ECommands.descending,
				);
				expect(result).toBe(expectedFm.alphaReverse);
			});
			it("sort alphabetical with title (reverse)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(
					item.fileName,
					ECommands.AdvancedDesc,
				);
				expect(result).toBe(expectedFm.withTitleReverse);
			});
		});
	}
});

export async function testAllType(
	input: string,
	expected: Expectation,
	frontmatter?: Options,
) {
	const expectedFm = generatedFm(expected, frontmatter);
	it(`sort alphabetical`, function () {
		const result = runTestWithFixture(input, ECommands.Ascending);
		expect(result).toBe(expectedFm.alpha);
	});
	it(`sort alphabetical with title`, function () {
		const result = runTestWithFixture(input, ECommands.AdvancedAsc);
		expect(result).toBe(expectedFm.withTitle);
	});
	it(`sort alphabetical (reverse)`, function () {
		const result = runTestWithFixture(input, ECommands.descending);
		expect(result).toBe(expectedFm.withTitle);
	});
	it(`sort alphabetical with title (reverse)`, function () {
		const result = runTestWithFixture(input, ECommands.AdvancedDesc);
		expect(result).toBe(expectedFm.withTitleReverse);
	});
}

const allFrontmatterPossibles: Options[] = [
	{
		title: "Default",
		sml_sort: true,
		sml_descending: false,
		sml_advanced: false,
		sml_level: 1,
	},
	{
		title: "Default + reverse",
		sml_sort: true,
		sml_descending: true,
		sml_advanced: false,
		sml_level: 1,
	},
	{
		title: "default + advanced",
		sml_sort: true,
		sml_descending: false,
		sml_advanced: true,
		sml_level: 1,
	},
	{
		title: "reverse + advanced",
		sml_sort: true,
		sml_descending: true,
		sml_advanced: true,
		sml_level: 1,
	},
	{
		title: "default + advanced",
		sml_sort: true,
		sml_descending: true,
		sml_advanced: true,
		sml_level: 1,
	},
];

describe("Automated frontmatter sort", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});
	for (const item of expecteds) {
		it(item.fileName, async () => {
			for (const frontmatter of allFrontmatterPossibles) {
				it(`${frontmatter.title}`, async function () {
					const generatedExpected = generatedFm(item.expected, frontmatter);
					const result = await runTestWithFixture(
						item.fileName,
						ECommands.AutoOnFrontmatter,
						frontmatter,
					);
					const expectedResult = getExpectedKey(frontmatter.title);
					expect(result).toBe("uwu");
				});
			}
		});
	}
});

describe("Neg test", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});

	it("The command should not exists", async () => {
		await createFixture("simple_list.md", {
			title: "Disabled sort",
			sml_sort: false,
			sml_descending: true,
			sml_advanced: true,
			sml_level: 1,
		});
		//we should FAIL to execute the command in the command palette
		let error = false;
		try {
			await browser.executeObsidianCommand(ECommands.AutoOnFrontmatter);
		} catch (e) {
			error = true;
		}
		expect(error).toBe(true);
	});
});
