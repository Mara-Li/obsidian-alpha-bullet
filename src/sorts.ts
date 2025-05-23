import "uniformize";

const MARKDOWN_PREFIX = /^[*+-] /;
const TITLE_PREFIX = /^#+ /;

export class BulletSort {
	constructor(private headingLevel: number = 1) {}

	getHeading(): string {
		const level = Math.min(Math.max(this.headingLevel, 1), 6);
		return "#".repeat(level);
	}

	isList(line: string): boolean {
		return line.match(/^\s*[*+-] /) !== null && line.split("\n").length > 1;
	}

	private getSortableText(line: string): string {
		return (line.split(":")[0].replace(/\W+/g, "") ?? line).standardize();
	}

	private isIndented(line: string): boolean {
		return line.startsWith(" ") || line.startsWith("\t");
	}

	// Extrait un groupe de blocs markdown (avec sous-lignes indentées)
	private extractListBlocks(lines: string[], start: number): [number, string[][]] {
		const blocks: string[][] = [];
		let i = start;

		while (i < lines.length && lines[i].match(MARKDOWN_PREFIX)) {
			const block: string[] = [lines[i++]];

			while (i < lines.length && this.isIndented(lines[i])) {
				block.push(lines[i++]);
			}

			blocks.push(block);
		}

		return [i, blocks];
	}

	private sortBlocks(blocks: string[][], reverse: boolean): string[][] {
		return blocks.sort((a, b) => {
			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});
			return reverse
				? collator.compare(this.getSortableText(b[0]), this.getSortableText(a[0]))
				: collator.compare(this.getSortableText(a[0]), this.getSortableText(b[0]));
		});
	}

	sort(markdown: string, reverse = false): string {
		const lines = markdown.split("\n");
		const result: string[] = [];

		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(MARKDOWN_PREFIX)) {
				const [end, blocks] = this.extractListBlocks(lines, i);
				const sorted = this.sortBlocks(blocks, reverse);
				result.push(...sorted.map((block) => block.join("\n")));
				i = end;
			} else {
				result.push(lines[i++]);
			}
		}

		return result.join("\n");
	}

	sortByLetter(markdown: string, reverseGroup = false, reverseItems = false): string {
		const lines = markdown.split("\n");
		const result: string[] = [];

		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(TITLE_PREFIX)) {
				while (i < lines.length && lines[i].match(TITLE_PREFIX)) i++;
				continue;
			}

			if (lines[i].match(MARKDOWN_PREFIX)) {
				const [end, blocks] = this.extractListBlocks(lines, i);

				const groups = new Map<string, string[][]>();

				for (const block of blocks) {
					const firstLetter = block[0]
						.replace(MARKDOWN_PREFIX, "")
						.trim()?.[0]
						?.standardize();

					if (firstLetter) {
						if (!groups.has(firstLetter)) groups.set(firstLetter, []);
						groups.get(firstLetter)!.push(block);
					}
				}

				const sortedKeys = Array.from(groups.keys()).sort((a, b) =>
					reverseGroup ? b.localeCompare(a) : a.localeCompare(b)
				);

				for (const key of sortedKeys) {
					const sortedBlocks = this.sortBlocks(groups.get(key)!, reverseItems);
					result.push(`${this.getHeading()} ${key.toUpperCase()}`);
					result.push(...sortedBlocks.map((block) => block.join("\n")));
				}

				i = end;
			} else {
				result.push(lines[i++]);
			}
		}

		return result.join("\n");
	}

	private cleanLines(content: string): string {
		const lines = content.split("\n");
		return lines
			.filter((line) => {
				const match = line.match(TITLE_PREFIX);
				if (!match) return true;
				const title = line.replace(TITLE_PREFIX, "").trim();
				return title.length !== 1 || !/^[A-ZÀ-Ÿ]$/i.test(title);
			})
			.join("\n");
	}

	cleanSort(content: string, reverse = false): string {
		return this.sort(this.cleanLines(content), reverse);
	}

	cleanSortByGroup(
		content: string,
		reverseGroup = false,
		reverseItems?: boolean
	): string {
		return this.sortByLetter(this.cleanLines(content), reverseGroup, reverseItems);
	}
}
