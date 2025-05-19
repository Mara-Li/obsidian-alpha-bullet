import "uniformize";

const MARKDOWN_PREFIX = /^[\*+-]/;

function getSortableText(line: string) {
	return (line.split(":")[0] ?? line).standardize();
}

function extractListBlocks(lines: string[]) {
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

// Trie chaque groupe de listes séparément, laisse le reste intact
export function sortAlphabetical(markdown: string) {
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
			const blocks = extractListBlocks(groupLines);
			blocks.sort((a, b) => getSortableText(a[0]).localeCompare(getSortableText(b[0])));
			result.push(...blocks.map((block) => block.join("\n")));
			i = end;
		} else {
			result.push(lines[i]);
			i++;
		}
	}
	return result.join("\n");
}

// Trie chaque groupe de listes séparément, ajoute les titres, laisse le reste intact
export function alphabeticalWithTitle(markdown: string) {
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
				getSortableText(a.lines[0]).localeCompare(getSortableText(b.lines[0]))
			);
			const grouped = new Map<string, string[][]>();
			for (const block of blocks) {
				if (!grouped.has(block.key)) grouped.set(block.key, []);
				grouped.get(block.key)!.push(block.lines);
			}
			const sortedKeys = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
			result.push(
				sortedKeys
					.map(
						(key) =>
							`## ${key.toUpperCase()}\n${grouped
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

export function replaceAlphaListInMarkdown(content: string) {
	return sortAlphabetical(content);
}

export function replaceAlphaListWithTitleInMarkdown(content: string) {
	return alphabeticalWithTitle(content);
}
