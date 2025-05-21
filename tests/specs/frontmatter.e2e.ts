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
import path from "path";
import fs from "fs";

const allFrontmatterPossibles: Options[] = [
	{
		title: ECommands.Ascending,
		sml_sort: true,
		sml_descending: false,
		sml_advanced: false,
		sml_level: 2,
	},
	{
		title: ECommands.descending,
		sml_sort: true,
		sml_descending: true,
		sml_advanced: false,
		sml_level: 2,
	},
	{
		title: ECommands.AdvancedAsc,
		sml_sort: true,
		sml_descending: false,
		sml_advanced: true,
		sml_level: 2,
	},
	{
		title: ECommands.AdvancedDesc,
		sml_sort: true,
		sml_descending: true,
		sml_advanced: true,
		sml_level: 2,
	},
];

async function createFixture(fixtureName: string, frontmatter?: Options) {
	const folder = path.resolve(__dirname, "..");
	const fixtures = path.resolve(folder, "fixtures");
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
	const fileOpened = await browser.executeObsidian(
		async ({ app, obsidian }) => {
			const leaf = app.workspace.getActiveViewOfType(
				obsidian.MarkdownView,
			)?.leaf;
			if (leaf?.view instanceof obsidian.MarkdownView) {
				return leaf.view.file?.path;
			}
			return null;
		},
	);
	expect(fileOpened).toBe(fixtureName);
}

async function runTestWithFixture(
	fixtureName: string,
	command: ECommands,
	frontmatter?: Options,
) {
	await createFixture(fixtureName, frontmatter);
	await browser.executeObsidianCommand(`${manifest.id}:${command}`);
	return await browser.executeObsidian(async ({ app, obsidian }, fileName) => {
		const file = app.vault.getAbstractFileByPath(fileName);
		if (file && file instanceof obsidian.TFile) {
			return await app.vault.read(file);
		}
		return "";
	}, fixtureName);
}

describe("Automated frontmatter sort", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});
	for (const item of expecteds) {
		describe(item.fileName, () => {
			for (const frontmatter of allFrontmatterPossibles) {
				it(`frontmatter: ${frontmatter.title}`, async function () {
					const generatedExpected = generatedFm(item.expected, frontmatter);
					const result = await runTestWithFixture(
						item.fileName,
						ECommands.AutoOnFrontmatter,
						frontmatter,
					);
					const expectedKey = getExpectedKey(frontmatter.title);
					expect(result).toBe(generatedExpected[expectedKey]);
				});
			}
		});
	}
});
