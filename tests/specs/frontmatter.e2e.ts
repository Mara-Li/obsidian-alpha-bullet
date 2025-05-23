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
import { normalize } from "./helper";

const allFrontmatterPossibles: Options[] = [
	{
		title: ECommands.Ascending,
		sml_sort: true,
		sml_descending: false,
		sml_group: false,
		sml_level: 2,
	},
	{
		title: ECommands.Descending,
		sml_sort: true,
		sml_descending: true,
		sml_group: false,
		sml_level: 2,
	},
	{
		title: ECommands.GroupFullAsc,
		sml_sort: true,
		sml_descending: false,
		sml_group: true,
		sml_level: 2,
	},
	{
		title: ECommands.GroupFullDesc,
		sml_sort: true,
		sml_descending: true,
		sml_group: true,
		sml_level: 2,
	},
];

async function createFixture(fixtureName: string, frontmatter?: Options) {
	const folder = path.resolve(__dirname, "..");
	const fixtures = path.resolve(folder, "fixtures");
	const fixtureContent = fs.readFileSync(path.join(fixtures, fixtureName), "utf-8");
	const frontmatterContent = stringifyFrontmatter(frontmatter);
	await browser.executeObsidian(
		async ({ app }, content, fileName, fm) => {
			if (fm) content = `${fm}${content}`;
			await app.vault.create(fileName, content);
		},
		fixtureContent,
		fixtureName,
		frontmatterContent
	);
	await obsidianPage.openFile(fixtureName);
	const fileOpened = await browser.executeObsidian(async ({ app, obsidian }) => {
		const leaf = app.workspace.getActiveViewOfType(obsidian.MarkdownView)?.leaf;
		if (leaf?.view instanceof obsidian.MarkdownView) {
			return leaf.view.file?.path;
		}
		return null;
	});
	expect(fileOpened).toBe(fixtureName);
}

async function runTestWithFixture(
	fixtureName: string,
	command: ECommands,
	frontmatter?: Options
) {
	await createFixture(fixtureName, frontmatter);
	await browser.executeObsidianCommand(`${manifest.id}:${command}`);
	const res = await browser.executeObsidian(async ({ app, obsidian }, fileName) => {
		const file = app.vault.getAbstractFileByPath(fileName);
		if (file && file instanceof obsidian.TFile) {
			return await app.vault.read(file);
		}
		return "";
	}, fixtureName);
	return normalize(res);
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
						frontmatter
					);
					const expectedKey = getExpectedKey(frontmatter.title);
					if (expectedKey.startsWith("group.")) {
						const key = expectedKey.replace("group.", "");
						if (
							key === "onlyReverseItems" &&
							generatedExpected.onlyReverseItems?.ascending
						) {
							expect(result).toBe(
								normalize(generatedExpected.onlyReverseItems.descending)
							);
						} else if (key === "ascending" || key === "descending") {
							expect(result).toBe(
								normalize(generatedExpected.group[key as "ascending" | "descending"])
							);
						}
					} else {
						expect(result).toBe(
							normalize(generatedExpected[expectedKey as "ascending" | "descending"])
						);
					}
				});
			}
		});
	}
});
