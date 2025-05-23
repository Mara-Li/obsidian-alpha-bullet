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
	EXPECT_NATURAL_ORDER,
	EXPECT_REVERSE_GROUP,
} from "../fixtures";
import { reverse } from "dns";

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

export function generatedFm(
	expected: Expectation,
	frontmatter?: Options,
): Expectation {
	const fm = stringifyFrontmatter(frontmatter);
	return {
		ascending: normalize(`${fm}${expected.ascending}`),
		descending: normalize(`${fm}${expected.descending}`),
		advanced: {
			ascending: normalize(`${fm}${expected.advanced.ascending}`),
			descending: normalize(`${fm}${expected.advanced.descending}`),
		},
		reverseGroup: expected.reverseGroup
			? {
					ascending: normalize(`${fm}${expected.reverseGroup.ascending}`),
					descending: normalize(`${fm}${expected.reverseGroup.descending}`),
				}
			: undefined,
	};
}

export function getExpectedKey(title?: string) {
	switch (title) {
		case ECommands.Ascending:
			return "ascending";
		case ECommands.Descending:
			return "descending";
		case ECommands.AdvancedAsc:
			return "advanced.ascending";
		case ECommands.AdvancedDesc:
			return "advanced.descending";
		case ECommands.GroupOnlyAsc:
			return "reverseGroup.ascending";
		case ECommands.GroupOnlyDesc:
			return "reverseGroup.descending";
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
	{
		fileName: "natural_order.md",
		expected: EXPECT_NATURAL_ORDER,
	},
	{
		fileName: "reverse_group.md",
		expected: EXPECT_REVERSE_GROUP,
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
