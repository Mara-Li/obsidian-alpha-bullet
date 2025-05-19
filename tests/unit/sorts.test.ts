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
	return readFileSync(join(__dirname, "../fixtures", name), "utf8")
		.trim()
		.replaceAll(/\r\n/g, "\n");
}

const sort = new Sorts(2);

function testAllListTypes(input: string, expected: Expectation) {
	const types = ["-", "*", "+"];
	for (const type of types) {
		const inputList = input.replace(/^- /gm, `${type} `);
		const alphaExpected = expected.alpha.replace(/^- /gm, `${type} `);
		const withTitleExpected = expected.withTitle.replace(/^- /gm, `${type} `);
		const alphaExpectedReverse = expected.alphaReverse.replace(
			/^- /gm,
			`${type} `,
		);
		const withTitleExpectedReverse = expected.withTitleReverse.replace(
			/^- /gm,
			`${type} `,
		);

		test(`sortAlphabetical (${type})`, () => {
			expect(sort.sortAlphabetical(inputList)).toEqual(alphaExpected);
		});
		test(`alphabeticalWithTitle (${type})`, () => {
			expect(sort.alphabeticalWithTitle(inputList)).toEqual(withTitleExpected);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type})`, () => {
			expect(sort.replaceAlphaListWithTitleInMarkdown(inputList)).toEqual(
				withTitleExpected,
			);
		});

		// Tests inversés
		test(`sortAlphabetical (${type}, reverse)`, () => {
			expect(sort.sortAlphabetical(inputList, true)).toEqual(
				alphaExpectedReverse,
			);
		});
		test(`alphabeticalWithTitle (${type}, reverse)`, () => {
			expect(sort.alphabeticalWithTitle(inputList, true)).toEqual(
				withTitleExpectedReverse,
			);
		});
		test(`replaceAlphaListWithTitleInMarkdown (${type}, reverse)`, () => {
			expect(sort.replaceAlphaListWithTitleInMarkdown(inputList, true)).toEqual(
				withTitleExpectedReverse,
			);
		});
	}
}

describe("simple_list", () => {
	const input = loadFixture("simple_list.md");
	testAllListTypes(input, EXPECT_SIMPLE_LIST);
});

describe("fruits_animals", () => {
	const input = loadFixture("fruits_animals.md");
	testAllListTypes(input, EXPECT_FRUITS_ANIMALS);
});

describe("mixed_content", () => {
	const input = loadFixture("mixed_content.md");
	testAllListTypes(input, EXPECT_MIXED_CONTENT);
});

describe("accents_case", () => {
	const input = loadFixture("accents_case.md");
	testAllListTypes(input, EXPECT_ACCENTS_CASE);
});

describe("Verify heading level", () => {
	const headingToTest = [0, 1, 6, 7]; //Extreme case based on < min and > max
	const expected = ["#", "#", "######", "######"];
	for (const i in headingToTest) {
		const headingLevel = headingToTest[i];
		const expectedHeading = expected[i];
		test(`Heading level ${headingLevel} → ${expectedHeading}`, () => {
			const sort = new Sorts(headingLevel);
			const result = sort.getHeading();
			expect(result).toBe(expectedHeading);
		});
	}
});
