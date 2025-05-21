import { describe, expect, test } from "bun:test";
import { BulletSort } from "../../src/sorts";
import dedent from "dedent";

describe("replaceAlphaListWithTitleInMarkdown", () => {
	const sorter = new BulletSort(2); // heading level ##

	const unorderedList = ["## Z", "+ Zèbre: animal", "## É", "+ Été: été"].join(
		"\n",
	);

	const expectedAZ = ["## E", "+ Été: été", "## Z", "+ Zèbre: animal"].join(
		"\n",
	);

	const expectedZA = ["## Z", "+ Zèbre: animal", "## E", "+ Été: été"].join(
		"\n",
	);

	test("from Z → A to A → Z", () => {
		const sorted = sorter.replaceAlphaListWithTitleInMarkdown(
			unorderedList,
			false,
		);
		expect(normalizeNewlines(sorted)).toBe(normalizeNewlines(expectedAZ));
	});

	test("from A → Z to Z → A", () => {
		const sorted = sorter.replaceAlphaListWithTitleInMarkdown(expectedAZ, true);
		expect(normalizeNewlines(sorted)).toBe(normalizeNewlines(expectedZA));
	});
});

function normalizeNewlines(str: string): string {
	return str.replace(/\r\n?/g, "\n");
}
