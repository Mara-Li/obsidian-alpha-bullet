export interface Expectation {
	ascending: string;
	advanced: string;
	advancedAsc: string;
	AdvancedDesc: string;
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
	advancedAsc: [
		"- Magic: wand",
		"  - sub: spell",
		"- Arcane: book",
		"  - sub: page",
	].join("\n"),
	AdvancedDesc: [
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
	advancedAsc: [
		"- Zebra: animal",
		"  - sub: stripes",
		"- Banana: fruit",
		"  - sub: yellow",
		"- Apple: fruit",
		"  - sub: red",
	].join("\n"),
	AdvancedDesc: [
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
	advancedAsc: [
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
	AdvancedDesc: [
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
	advancedAsc: ["- Zèbre: animal", "- Été: été"].join("\n"),
	AdvancedDesc: ["## Z", "- Zèbre: animal", "## E", "- Été: été"].join("\n"),
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
	advancedAsc: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.advancedAsc,
	AdvancedDesc: FRONTMATTER_TEST + EXPECT_MIXED_CONTENT.AdvancedDesc,
};
