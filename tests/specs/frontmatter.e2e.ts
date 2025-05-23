/** biome-ignore-all lint/style/useNamingConvention: frontmatter key is snake_case */

import { browser } from "@wdio/globals";
import fs from "fs";
import path from "path";
import { obsidianPage } from "wdio-obsidian-service";
import { ECommands } from "../../src/interfaces";
import {
	expecteds,
	generatedFm,
	getExpectedKey,
	manifest,
	normalize,
	type Options,
	stringifyFrontmatter,
} from "./helper";

const allFrontmatterPossibles: Options[] = [
	{
		title: ECommands.Ascending,
		sml_sort: true,
		sml_descending: false,
		sml_glossary: false,
		sml_level: 2,
		sml_glossary_desc: false,
	},
	{
		title: ECommands.Descending,
		sml_sort: true,
		sml_descending: true,
		sml_glossary: false,
		sml_level: 2,
		sml_glossary_desc: false,
	},
	{
		title: ECommands.GlossaryFullAsc,
		sml_sort: true,
		sml_descending: false,
		sml_glossary: true,
		sml_level: 2,
		sml_glossary_desc: false,
	},
	{
		title: ECommands.GlossaryFullDesc,
		sml_sort: true,
		sml_descending: true,
		sml_glossary: true,
		sml_level: 2,
		sml_glossary_desc: true,
	},
	{
		title: ECommands.GlossaryAscItemsDesc,
		sml_sort: true,
		sml_descending: false,
		sml_glossary: true,
		sml_level: 2,
		sml_glossary_desc: true,
	},
	{
		title: ECommands.GlossaryDescItemAsc,
		sml_sort: true,
		sml_descending: true,
		sml_glossary: true,
		sml_level: 2,
		sml_glossary_desc: false,
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
						const key = expectedKey.replace("group.", "") as "ascending" | "descending";
						expect(result).toBe(
							normalize(generatedExpected.group[key as "ascending" | "descending"])
						);
					} else if (expectedKey.startsWith("onlyReverseItems.")) {
						if (!generatedExpected.onlyReverseItems) return;
						const key = expectedKey.replace("onlyReverseItems.", "") as
							| "ascending"
							| "descending";
						expect(result).toBe(
							normalize(
								generatedExpected.onlyReverseItems![key as "ascending" | "descending"]
							)
						);
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
