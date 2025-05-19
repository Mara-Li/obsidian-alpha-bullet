import { readFileSync } from "fs";
import { join } from "path";
import { Sorts } from "../../src/sorts";
import {
	EXPECT_ACCENTS_CASE,
	EXPECT_FRUITS_ANIMALS,
	EXPECT_MIXED_CONTENT,
	EXPECT_SIMPLE_LIST,
	type Expectation,
} from "../fixtures";

function loadFixture(name: string): string {
	return readFileSync(join(__dirname, "../fixtures", name), "utf8").trim();
}

const sort = new Sorts(2);

function testAllListTypes(input: string, expected: Expectation) {
	const types = ["-", "*", "+"];
	for (const type of types) {
		const inputList = input.replace(/^- /gm, `${type} `);
		const alphaExpected = expected.alpha.replace(/^- /gm, `${type} `);
		const withTitleExpected = expected.withTitle.replace(/^- /gm, `${type} `);
		const alphaExpectedReverse = expected.alphaReverse.replace(/^- /gm, `${type} `);
		const withTitleExpectedReverse = expected.withTitleReverse.replace(
			/^- /gm,
			`${type} `
		);

		test(`sortAlphabetical (${type})`, () => {
			expect(sort.sortAlphabetical(inputList)).toBe(alphaExpected);
		});
		test(`alphabeticalWithTitle (${type})`, () => {
			expect(sort.alphabeticalWithTitle(inputList)).toBe(withTitleExpected);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type})`, () => {
			expect(sort.replaceAlphaListWithTitleInMarkdown(inputList)).toBe(withTitleExpected);
		});

		// Tests inversés
		test(`sortAlphabetical (${type}, reverse)`, () => {
			expect(sort.sortAlphabetical(inputList, true)).toBe(alphaExpectedReverse);
		});
		test(`alphabeticalWithTitle (${type}, reverse)`, () => {
			expect(sort.alphabeticalWithTitle(inputList, true)).toBe(withTitleExpectedReverse);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type}, reverse)`, () => {
			expect(sort.replaceAlphaListWithTitleInMarkdown(inputList, true)).toBe(
				withTitleExpectedReverse
			);
		});
	}
}

describe("sorts.ts", () => {
	describe("simple_list.md", () => {
		const input = loadFixture("simple_list.md");
		testAllListTypes(input, EXPECT_SIMPLE_LIST);
	});

	describe("fruits_animals.md", () => {
		const input = loadFixture("fruits_animals.md");
		testAllListTypes(input, EXPECT_FRUITS_ANIMALS);
	});

	describe("mixed_content.md", () => {
		const input = loadFixture("mixed_content.md");
		testAllListTypes(input, EXPECT_MIXED_CONTENT);
	});

	describe("accents_case.md", () => {
		const input = loadFixture("accents_case.md");
		testAllListTypes(input, EXPECT_ACCENTS_CASE);
	});
});
