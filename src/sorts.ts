import "uniformize";

const MARKDOWN_PREFIX = /^[\*+-]/;

export class Sorts {
	constructor(private headingLevel: number = 1) {}

	private getSortableText(line: string) {
		return (line.split(":")[0] ?? line).standardize();
	}

	private extractListBlocks(lines: string[]) {
		const blocks: string[][] = [];
		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(MARKDOWN_PREFIX)) {
				const block: string[] = [lines[i]];
				i++;
				while (
					i < lines.length &&
					(lines[i].startsWith(" ") || lines[i].startsWith("\t"))
				) {
					block.push(lines[i]);
					i++;
				}
				blocks.push(block);
			} else {
				i++;
			}
		}
		return blocks;
	}

	private getHeading() {
		const level = this.headingLevel;
		return level > 0 ? "#".repeat(level) : "#"; // Default to level 1
	}

	sortAlphabetical(markdown: string, reverse: boolean = false) {
		const lines = markdown.split("\n");
		const result: string[] = [];
		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(MARKDOWN_PREFIX)) {
				const start = i;
				let end = i;
				while (
					end < lines.length &&
					(lines[end].match(MARKDOWN_PREFIX) ||
						lines[end].startsWith(" ") ||
						lines[end].startsWith("\t"))
				) {
					end++;
				}
				const groupLines = lines.slice(start, end);
				const blocks = this.extractListBlocks(groupLines);
				blocks.sort((a, b) =>
					reverse
						? this.getSortableText(b[0]).localeCompare(this.getSortableText(a[0]))
						: this.getSortableText(a[0]).localeCompare(this.getSortableText(b[0]))
				);
				result.push(...blocks.map((block) => block.join("\n")));
				i = end;
			} else {
				result.push(lines[i]);
				i++;
			}
		}
		return result.join("\n");
	}

	alphabeticalWithTitle(markdown: string, reverse: boolean = false) {
		const lines = markdown.split("\n");
		const result: string[] = [];
		let i = 0;
		while (i < lines.length) {
			if (lines[i].match(MARKDOWN_PREFIX)) {
				const start = i;
				let end = i;
				while (
					end < lines.length &&
					(lines[end].match(MARKDOWN_PREFIX) ||
						lines[end].startsWith(" ") ||
						lines[end].startsWith("\t"))
				) {
					end++;
				}
				const groupLines = lines.slice(start, end);
				// Regroupement par lettre
				const blocks: { key: string; lines: string[] }[] = [];
				let j = 0;
				while (j < groupLines.length) {
					if (groupLines[j].match(MARKDOWN_PREFIX)) {
						const block: string[] = [groupLines[j]];
						const firstLetter = groupLines[j]
							.replace(MARKDOWN_PREFIX, "")
							.trim()?.[0]
							?.toLowerCase();
						j++;
						while (
							j < groupLines.length &&
							(groupLines[j].startsWith(" ") || groupLines[j].startsWith("\t"))
						) {
							block.push(groupLines[j]);
							j++;
						}
						if (firstLetter) {
							blocks.push({ key: firstLetter, lines: block });
						}
					} else {
						j++;
					}
				}
				blocks.sort((a, b) =>
					reverse
						? this.getSortableText(b.lines[0]).localeCompare(
								this.getSortableText(a.lines[0])
							)
						: this.getSortableText(a.lines[0]).localeCompare(
								this.getSortableText(b.lines[0])
							)
				);
				const grouped = new Map<string, string[][]>();
				for (const block of blocks) {
					if (!grouped.has(block.key)) grouped.set(block.key, []);
					grouped.get(block.key)!.push(block.lines);
				}
				const sortedKeys = Array.from(grouped.keys()).sort((a, b) =>
					reverse ? b.localeCompare(a) : a.localeCompare(b)
				);
				result.push(
					sortedKeys
						.map(
							(key) =>
								`${this.getHeading()} ${key.toUpperCase()}\n${grouped
									.get(key)!
									.map((lines) => lines.join("\n"))
									.join("\n")}`
						)
						.join("\n")
				);
				i = end;
			} else {
				result.push(lines[i]);
				i++;
			}
		}
		return result.join("\n");
	}

	replaceAlphaListInMarkdown(content: string, reverse: boolean = false) {
		return this.sortAlphabetical(content, reverse);
	}

	replaceAlphaListWithTitleInMarkdown(content: string, reverse: boolean = false) {
		return this.alphabeticalWithTitle(content, reverse);
	}
}
