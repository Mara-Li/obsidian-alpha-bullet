import * as fs from "fs";
import * as path from "path";
import { ECommands, AlphaBulletSettings } from "../../src/interfaces";
import {
	EXPECT_SIMPLE_LIST,
	EXPECT_FRONTMATTER,
	type Expectation,
	EXPECT_FRUITS_ANIMALS,
	EXPECT_MIXED_CONTENT,
	EXPECT_ACCENTS_CASE,
} from "../fixtures";

export const manifest = JSON.parse(
	fs.readFileSync(
		`${path.resolve(__dirname, "..", "..", "manifest.json")}`,
		"utf-8",
	),
) as { id: string; name: string; version: string };

export type Options = {
	title?: ECommands | string;
} & AlphaBulletSettings;

export function stringifyFrontmatter(frontmatter?: Options): string {
	if (!frontmatter) return "";
	return [
		"---",
		`sml_sort: ${frontmatter.sml_sort}`,
		`sml_descending: ${frontmatter.sml_descending}`,
		`sml_advanced: ${frontmatter.sml_advanced}`,
		`sml_level: ${frontmatter.sml_level}`,
		"---",
		"",
	].join("\n");
}

export function generatedFm(expected: Expectation, frontmatter?: Options) {
	const fm = stringifyFrontmatter(frontmatter);
	return {
		alpha: normalize(`${fm}${expected.ascending}`),
		alphaReverse: normalize(`${fm}${expected.descending}`),
		withTitle: normalize(`${fm}${expected.advanced}`),
		withTitleReverse: normalize(`${fm}${expected.advancedDesc}`),
	};
}

export function getExpectedKey(title?: string) {
	switch (title) {
		case ECommands.Ascending:
			return "alpha";
		case ECommands.Descending:
			return "alphaReverse";
		case ECommands.AdvancedAsc:
			return "withTitle";
		case ECommands.AdvancedDesc:
			return "withTitleReverse";
		default:
			throw new Error(`Unknown command: ${title}`);
	}
}

export const expecteds = [
	{
		fileName: "simple_list.md",
		expected: EXPECT_SIMPLE_LIST,
	},
	{
		fileName: "fruits_animals.md",
		expected: EXPECT_FRUITS_ANIMALS,
	},
	{
		fileName: "mixed_content.md",
		expected: EXPECT_MIXED_CONTENT,
	},
	{
		fileName: "accents_case.md",
		expected: EXPECT_ACCENTS_CASE,
	},
	{
		fileName: "with_frontmatter.md",
		expected: EXPECT_FRONTMATTER,
	},
];

export function normalize(str: string) {
	return str
		.replace(/\r\n/g, "\n") // Windows → Unix
		.replace(/\r/g, "\n") // Mac old-style → Unix
		.replace(/\s+$/g, "")
		.trimEnd(); // Remove trailing whitespace;
}

export const folder = path.resolve(__dirname, "..");
export const fixtures = path.resolve(folder, "fixtures");
