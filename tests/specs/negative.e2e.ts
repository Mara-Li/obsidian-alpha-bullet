import { obsidianPage } from "wdio-obsidian-service";
import { ECommands } from "../../src/interfaces";
import { fixtures, stringifyFrontmatter, type Options } from "./helper";
import path from "path";
import fs from "fs";
async function createFixture(fixtureName: string, frontmatter?: Options) {
	const fixtureContent = fs.readFileSync(
		path.join(fixtures, fixtureName),
		"utf-8",
	);
	const frontmatterContent = stringifyFrontmatter(frontmatter);
	await browser.executeObsidian(
		async ({ app }, content, fileName, fm) => {
			if (fm) content = `${fm}${content}`;
			await app.vault.create(fileName, content);
		},
		fixtureContent,
		fixtureName,
		frontmatterContent,
	);

	await obsidianPage.openFile(fixtureName);
	const fileOpened = await browser.executeObsidian(({ app, obsidian }) => {
		const leaf = app.workspace.getActiveViewOfType(obsidian.MarkdownView)?.leaf;
		if (leaf?.view instanceof obsidian.MarkdownView) {
			return leaf.view.file?.path;
		}
		return null;
	});

	expect(fileOpened).toBe(fixtureName);
}

describe("Negative tests", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});

	it("should fail to execute the command if sort is disabled in frontmatter", async () => {
		await createFixture("simple_list.md", {
			title: "Disabled sort",
			sml_sort: false,
			sml_descending: true,
			sml_advanced: true,
			sml_level: 1,
		});
		let error = false;
		try {
			await browser.executeObsidianCommand(ECommands.AutoOnFrontmatter);
		} catch (e) {
			error = true;
		}
		expect(error).toBe(true);
	});
});
