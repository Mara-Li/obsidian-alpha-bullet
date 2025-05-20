/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import { browser, expect } from "@wdio/globals";
import * as fs from "fs";
import * as path from "path";
import { obsidianPage } from "wdio-obsidian-service";
import { ECommands, SortMarkdownListSettings } from "../../src/interfaces";
import {
	EXPECT_SIMPLE_LIST,
	WITH_FRONTMATTER,
	type Expectation,
} from "../fixtures";

export const manifest = JSON.parse(
	fs.readFileSync(
		`${path.resolve(__dirname, "..", "..", "manifest.json")}`,
		"utf-8",
	),
) as { id: string; name: string; version: string };

import dedent from "dedent";

console.log(`Running tests for ${manifest.name} v${manifest.version}`);

const folder = path.resolve(__dirname, "..");
const fixtures = path.resolve(folder, "fixtures");

export type Options = {
	title?: string;
} & SortMarkdownListSettings;

function stringifyFrontmatter(frontmatter?: Options): string {
	return frontmatter
		? dedent(`---
			sml_sort: ${frontmatter.sml_sort};
			sml_descending: ${frontmatter.sml_descending};
			sml_advanced: ${frontmatter.sml_advanced};
			sml_level: ${frontmatter.sml_level};
			---\n
	`)
		: "";
}

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

async function runTestWithFixture(
	fixtureName: string,
	command: ECommands,
	frontmatter?: Options,
) {
	await createFixture(fixtureName, frontmatter);
	await browser.executeObsidianCommand(`${manifest.id}:${command}`);

	//return updated content
	return await browser.executeObsidian(({ app, obsidian }, fileName) => {
		const file = app.vault.getAbstractFileByPath(fileName);
		if (file && file instanceof obsidian.TFile) {
			return app.vault.read(file);
		}
		return "";
	}, fixtureName);
}

function generatedFm(expected: Expectation, frontmatter?: Options) {
	const strifiyedFrontmatter = frontmatter
		? dedent(`---
			sml_sort: ${frontmatter.sml_sort};
			sml_descending: ${frontmatter.sml_descending};
			sml_advanced: ${frontmatter.sml_advanced};
			sml_level: ${frontmatter.sml_level};
			---\n
	`)
		: "";
	return {
		alpha: dedent(`${strifiyedFrontmatter}${expected.alpha}`),
		alphaReverse: dedent(`${strifiyedFrontmatter}${expected.alphaReverse}`),
		withTitle: dedent(`${strifiyedFrontmatter}${expected.withTitle}`),
		withTitleReverse: dedent(
			`${strifiyedFrontmatter}${expected.withTitleReverse}`,
		),
	};
}

export async function testAllType(
	input: string,
	expected: Expectation,
	frontmatter?: Options,
) {
	const expectedFm = generatedFm(expected, frontmatter);
	it(`sort alphabetical`, async function () {
		const result = await runTestWithFixture(input, ECommands.Alphabetical);
		expect(result).toBe(expectedFm.alpha);
	});
	it(`sort alphabetical with title`, async function () {
		const result = await runTestWithFixture(input, ECommands.AdvancedAlpha);
		expect(result).toBe(expectedFm.withTitle);
	});
	it(`sort alphabetical (reverse)`, async function () {
		const result = await runTestWithFixture(input, ECommands.Reverse);
		expect(result).toBe(expectedFm.withTitle);
	});
	it(`sort alphabetical with title (reverse)`, async function () {
		const result = await runTestWithFixture(input, ECommands.AdvancedReverse);
		expect(result).toBe(expectedFm.withTitleReverse);
	});
}

export async function addFrontmatter(input: string, expected: Expectation) {
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

	for (const frontmatter of allFrontmatterPossibles) {
		it(`${frontmatter.title}`, async function () {
			const generatedExpected = generatedFm(expected, frontmatter);
			const result = await runTestWithFixture(
				input,
				ECommands.AutoOnFrontmatter,
				frontmatter,
			);
			expect(result).toBe(generatedExpected.alpha);
		});
	}
}

export const expecteds = [
	{
		fileName: "simple_list.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "fruits_animals.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "mixed_content.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "accents_case.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "simple_list.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "with_frontmatter.md",
		expected: WITH_FRONTMATTER,
	},
];
