import "uniformize";

const MARKDOWN_PREFIX = /^[\*+-] /;
const TITLE_PREFIX = /^#+ /;

export class Sorts {
	constructor(private headingLevel: number = 1) {}

	getHeading(): string {
		const level = Math.min(Math.max(this.headingLevel, 1), 6);
		return "#".repeat(level);
	}

	private getSortableText(line: string): string {
		return (line.split(":")[0].replace(/\W+/g, "") ?? line).standardize();
	}

	private isIndented(line: string): boolean {
		return line.startsWith(" ") || line.startsWith("\t");
	}

	// Extrait un groupe de blocs markdown (avec sous-lignes indentées)
	private extractListBlocks(
		lines: string[],
		start: number,
	): [number, string[][]] {
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
		return blocks.sort((a, b) =>
			reverse
				? this.getSortableText(b[0]).localeCompare(this.getSortableText(a[0]))
				: this.getSortableText(a[0]).localeCompare(this.getSortableText(b[0])),
		);
	}

	sortAlphabetical(markdown: string, reverse = false): string {
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

	alphabeticalWithTitle(markdown: string, reverse = false): string {
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
					reverse ? b.localeCompare(a) : a.localeCompare(b),
				);

				for (const key of sortedKeys) {
					const blocks = this.sortBlocks(groups.get(key)!, reverse);
					result.push(`${this.getHeading()} ${key.toUpperCase()}`);
					result.push(...blocks.map((block) => block.join("\n")));
				}

				i = end;
			} else {
				result.push(lines[i++]);
			}
		}

		return result.join("\n");
	}

	toggleAlphaListWithTitleOrder(markdown: string): string {
		const lines = markdown.split("\n");
		const sections: { title: string; content: string[] }[] = [];

		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(TITLE_PREFIX)) {
				const title = lines[i++];
				const content: string[] = [];

				while (i < lines.length && !lines[i].match(TITLE_PREFIX)) {
					content.push(lines[i++]);
				}

				sections.push({ title, content });
			} else {
				const content: string[] = [];

				while (i < lines.length && !lines[i].match(TITLE_PREFIX)) {
					content.push(lines[i++]);
				}

				if (content.length > 0) {
					sections.push({ title: "", content });
				}
			}
		}

		const titles = sections
			.filter((s) => s.title)
			.map((s) => s.title.replace(TITLE_PREFIX, "").trim().toUpperCase());

		const isAscending = titles.join("") <= [...titles].sort().join("");

		return (isAscending ? sections.reverse() : sections.slice().reverse())
			.map((s) => (s.title ? s.title + "\n" : "") + s.content.join("\n"))
			.join("\n");
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

	replaceAlphaListInMarkdown(content: string, reverse = false): string {
		return this.sortAlphabetical(this.cleanLines(content), reverse);
	}

	replaceAlphaListWithTitleInMarkdown(
		content: string,
		reverse = false,
	): string {
		return this.alphabeticalWithTitle(this.cleanLines(content), reverse);
	}
}
