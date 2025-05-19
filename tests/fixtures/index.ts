export interface Expectation {
	alpha: string;
	withTitle: string;
}

export const EXPECT_SIMPLE_LIST: Expectation = {
	alpha: ["- Arcane: book", "  - sub: page", "- Magic: wand", "  - sub: spell"].join(
		"\n"
	),
	withTitle: [
		"## A",
		"- Arcane: book",
		"  - sub: page",
		"## M",
		"- Magic: wand",
		"  - sub: spell",
	].join("\n"),
};

export const EXPECT_FRUITS_ANIMALS: Expectation = {
	alpha: [
		"- Apple: fruit",
		"  - sub: red",
		"- Banana: fruit",
		"  - sub: yellow",
		"- Zebra: animal",
		"  - sub: stripes",
	].join("\n"),
	withTitle: [
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
};

export const EXPECT_MIXED_CONTENT: Expectation = {
	alpha: [
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
	withTitle: [
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
};
