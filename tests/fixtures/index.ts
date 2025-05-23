export interface Expectation {
	ascending: string;
	advanced: string;
	descending: string;
	advancedDesc: string;
}

export const EXPECT_SIMPLE_LIST: Expectation = {
	ascending: [
		"- Arcane: book",
		"  - sub: page",
		"- Magic: wand",
		"  - sub: spell",
	].join("\n"),
	advanced: [
		"## A",
		"- Arcane: book",
		"  - sub: page",
		"## M",
		"- Magic: wand",
		"  - sub: spell",
	].join("\n"),
	descending: [
		"- Magic: wand",
		"  - sub: spell",
		"- Arcane: book",
		"  - sub: page",
	].join("\n"),
	advancedDesc: [
		"## M",
		"- Magic: wand",
		"  - sub: spell",
		"## A",
		"- Arcane: book",
		"  - sub: page",
	].join("\n"),
};

export const EXPECT_FRUITS_ANIMALS: Expectation = {
	ascending: [
		"- Apple: fruit",
		"  - sub: red",
		"- Banana: fruit",
		"  - sub: yellow",
		"- Zebra: animal",
		"  - sub: stripes",
	].join("\n"),
	advanced: [
		"## A",
		"- Apple: fruit",
		"  - sub: red",
		"## B",
		"- Banana: fruit",
		"  - sub: yellow",
		"## Z",
		"- Zebra: animal",
		"  - sub: stripes",
	].join("\n"),
	descending: [
		"- Zebra: animal",
		"  - sub: stripes",
		"- Banana: fruit",
		"  - sub: yellow",
		"- Apple: fruit",
		"  - sub: red",
	].join("\n"),
	advancedDesc: [
		"## Z",
		"- Zebra: animal",
		"  - sub: stripes",
		"## B",
		"- Banana: fruit",
		"  - sub: yellow",
		"## A",
		"- Apple: fruit",
		"  - sub: red",
	].join("\n"),
};

export const EXPECT_MIXED_CONTENT: Expectation = {
	ascending: [
		"Introduction",
		"",
		"- Apple: green",
		"- Banana: yellow",
		"",
		"Some text.",
		"",
		"- Cat: furry",
		"- Zebra: black and white",
	].join("\n"),
	advanced: [
		"Introduction",
		"",
		"## A",
		"- Apple: green",
		"## B",
		"- Banana: yellow",
		"",
		"Some text.",
		"",
		"## C",
		"- Cat: furry",
		"## Z",
		"- Zebra: black and white",
	].join("\n"),
	descending: [
		"Introduction",
		"",
		"- Banana: yellow",
		"- Apple: green",
		"",
		"Some text.",
		"",
		"- Zebra: black and white",
		"- Cat: furry",
	].join("\n"),
	advancedDesc: [
		"Introduction",
		"",
		"## B",
		"- Banana: yellow",
		"## A",
		"- Apple: green",
		"",
		"Some text.",
		"",
		"## Z",
		"- Zebra: black and white",
		"## C",
		"- Cat: furry",
	].join("\n"),
};

export const EXPECT_ACCENTS_CASE: Expectation = {
	ascending: ["- Été: été", "- Zèbre: animal"].join("\n"),
	advanced: ["## E", "- Été: été", "## Z", "- Zèbre: animal"].join("\n"),
	descending: ["- Zèbre: animal", "- Été: été"].join("\n"),
	advancedDesc: ["## Z", "- Zèbre: animal", "## E", "- Été: été"].join("\n"),
};

const FRONTMATTER_TEST = [
	"---",
	"title: Test Document",
	"date: 2023-10-01",
	"tags: ",
	"  - test",
	"  - example",
	"---",
	"",
].join("\n");

export const EXPECT_FRONTMATTER: Expectation = {
	ascending: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.ascending,
	advanced: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.advanced,
	descending: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.descending,
	advancedDesc: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.advancedDesc,
};

export const EXPECT_NATURAL_ORDER: Expectation = {
	ascending: ["- item1", "- item2", "- item10"].join("\n"),
	advanced: ["## I", "- item1", "- item2", "- item10"].join("\n"),
	descending: ["- item10", "- item2", "- item1"].join("\n"),
	advancedDesc: ["## I", "- item10", "- item2", "- item1"].join("\n"),
};
