import {
	sortAlphabetical,
	alphabeticalWithTitle,
	replaceAlphaListWithTitleInMarkdown,
} from "../../src/sorts";
import {
	EXPECT_SIMPLE_LIST,
	EXPECT_FRUITS_ANIMALS,
	EXPECT_MIXED_CONTENT,
	type Expectation,
} from "../fixtures/index";
import { readFileSync } from "fs";
import { join } from "path";

function loadFixture(name: string): string {
	return readFileSync(join(__dirname, "../fixtures", name), "utf8").trim();
}

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
			expect(sortAlphabetical(inputList)).toBe(alphaExpected);
		});
		test(`alphabeticalWithTitle (${type})`, () => {
			expect(alphabeticalWithTitle(inputList)).toBe(withTitleExpected);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type})`, () => {
			expect(replaceAlphaListWithTitleInMarkdown(inputList)).toBe(withTitleExpected);
		});

		// Tests inversés
		test(`sortAlphabetical (${type}, reverse)`, () => {
			expect(sortAlphabetical(inputList, true)).toBe(alphaExpectedReverse);
		});
		test(`alphabeticalWithTitle (${type}, reverse)`, () => {
			expect(alphabeticalWithTitle(inputList, true)).toBe(withTitleExpectedReverse);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type}, reverse)`, () => {
			expect(replaceAlphaListWithTitleInMarkdown(inputList, true)).toBe(
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
});
