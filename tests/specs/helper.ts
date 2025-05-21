/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import * as fs from "fs";
import * as path from "path";
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

export type Options = {
	title?: ECommands | string;
} & SortMarkdownListSettings;

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
		alpha: dedent(`${fm}${expected.ascending}`),
		alphaReverse: dedent(`${fm}${expected.advancedAsc}`),
		withTitle: dedent(`${fm}${expected.advanced}`),
		withTitleReverse: dedent(`${fm}${expected.AdvancedDesc}`),
	};
}

export function getExpectedKey(title?: string) {
	switch (title) {
		case ECommands.Ascending:
			return "alpha";
		case ECommands.descending:
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
