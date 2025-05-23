import * as fs from "fs";
import * as path from "path";
import { ECommands, type AlphaBulletSettings } from "../../src/interfaces";
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

export const manifest = JSON.parse(
	fs.readFileSync(`${path.resolve(__dirname, "..", "..", "manifest.json")}`, "utf-8")
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
		`sml_glossary: ${frontmatter.sml_glossary}`,
		`sml_level: ${frontmatter.sml_level}`,
		`sml_items_desc: ${frontmatter.sml_items_desc}`,
		"---",
		"",
	].join("\n");
}

export function generatedFm(expected: Expectation, frontmatter?: Options): Expectation {
	const fm = stringifyFrontmatter(frontmatter);
	return {
		ascending: normalize(`${fm}${expected.ascending}`),
		descending: normalize(`${fm}${expected.descending}`),
		group: {
			ascending: normalize(`${fm}${expected.group.ascending}`),
			descending: normalize(`${fm}${expected.group.descending}`),
		},
		onlyReverseItems: expected.onlyReverseItems
			? {
					ascending: normalize(`${fm}${expected.onlyReverseItems.ascending}`),
					descending: normalize(`${fm}${expected.onlyReverseItems.descending}`),
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
		case ECommands.GlossaryFullAsc:
			return "group.ascending";
		case ECommands.GlossaryFullDesc:
			return "group.descending";
		case ECommands.GlossaryAscItemsDesc:
			return "onlyReverseItems.ascending";
		case ECommands.GlossaryDescItemAsc:
			return "onlyReverseItems.descending";
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
