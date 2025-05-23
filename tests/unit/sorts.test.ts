import { readFileSync } from "fs";
import { join } from "path";
import { BulletSort } from "../../src/sorts";
import {
	EXPECT_ACCENTS_CASE,
	EXPECT_FRUITS_ANIMALS,
	EXPECT_MIXED_CONTENT,
	EXPECT_SIMPLE_LIST,
	EXPECT_FRONTMATTER,
	type Expectation,
	EXPECT_NATURAL_ORDER,
	EXPECT_REVERSE_GROUP,
} from "../fixtures";

function loadFixture(name: string): string {
	return readFileSync(join(__dirname, "../fixtures", name), "utf8")
		.trim()
		.replaceAll(/\r\n/g, "\n");
}

const sort = new BulletSort(2);

function testAllListTypes(input: string, expected: Expectation) {
	const types = ["-", "*", "+"];
	for (const type of types) {
		const inputList = input.replace(/^- /gm, `${type} `);
		const alphaExpected = expected.ascending.replace(/^- /gm, `${type} `);
		const advancedAsc = expected.advanced.ascending.replace(
			/^- /gm,
			`${type} `,
		);
		const advancedDesc = expected.descending.replace(/^- /gm, `${type} `);
		const withTitleExpectedReverse = expected.advanced.descending.replace(
			/^- /gm,
			`${type} `,
		);
		const groupOnlyAsc = expected.reverseGroup?.ascending.replace(
			/^- /gm,
			`${type} `,
		);
		const groupOnlyDesc = expected.reverseGroup?.descending.replace(
			/^- /gm,
			`${type} `,
		);

		test(`ascending (${type})`, () => {
			expect(sort.sort(inputList)).toEqual(alphaExpected);
		});
		test(`ascending advanced (${type})`, () => {
			expect(sort.sortByLetter(inputList)).toEqual(advancedAsc);
		});
		test(`Replace: ascending advanced (${type})`, () => {
			expect(sort.cleanSortByGroup(inputList)).toEqual(advancedAsc);
		});

		// Tests inversés
		test(`descending (${type})`, () => {
			expect(sort.sort(inputList, true)).toEqual(advancedDesc);
		});
		test(`descending advanced (${type})`, () => {
			expect(sort.sortByLetter(inputList, true)).toEqual(
				withTitleExpectedReverse,
			);
		});
		test(`replace: descending advanced (${type})`, () => {
			expect(sort.cleanSortByGroup(inputList, true)).toEqual(
				withTitleExpectedReverse,
			);
		});
		if (expected.reverseGroup) {
			test(`asc group only - reverse (${type})`, () => {
				expect(sort.sortByLetter(inputList, true, true)).toEqual(groupOnlyDesc);
			});
			test(`asc group only - reverse (${type})`, () => {
				expect(sort.sortByLetter(inputList, false, true)).toEqual(groupOnlyAsc);
			});
		}
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

describe("with_frontmatter", () => {
	const input = loadFixture("with_frontmatter.md");
	testAllListTypes(input, EXPECT_FRONTMATTER);
});

describe("natural_sort", () => {
	const input = loadFixture("natural_order.md");
	testAllListTypes(input, EXPECT_NATURAL_ORDER);
});

describe("Reverse group", () => {
	const input = loadFixture("reverse_group.md");
	testAllListTypes(input, EXPECT_REVERSE_GROUP);
});

describe("Verify heading level", () => {
	const headingToTest = [0, 1, 6, 7]; //Extreme case based on < min and > max
	const expected = ["#", "#", "######", "######"];
	for (const i in headingToTest) {
		const headingLevel = headingToTest[i];
		const expectedHeading = expected[i];
		test(`Heading level ${headingLevel} → ${expectedHeading}`, () => {
			const sort = new BulletSort(headingLevel);
			const result = sort.getHeading();
			expect(result).toBe(expectedHeading);
		});
	}
});
