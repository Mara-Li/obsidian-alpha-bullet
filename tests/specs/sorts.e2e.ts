/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import { obsidianPage } from "wdio-obsidian-service";
import {
	addFrontmatter,
	createFixture,
	ECommands,
	expecteds,
	manifest,
	testAllType,
	type Options,
} from ".";

describe("No frontmatter sort", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});
	for (const item of expecteds) {
		it(item.fileName, async () => {
			await testAllType(item.fileName, item.expected);
		});
	}
});

describe("Automated frontmatter sort", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});
	for (const item of expecteds) {
		it(item.fileName, async () => {
			await addFrontmatter(item.fileName, item.expected);
		});
	}
});

describe("Neg test", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});

	it("The command should not exists", async () => {
		await createFixture("simple_list.md", {
			title: "Disabled sort",
			sml_sort: false,
			sml_reverse: true,
			sml_advanced: true,
			sml_level: 1,
		});
		const command = await browser.executeObsidian(({ app }, commandName) => {
			return app.commands.findCommand(commandName) ?? null;
		}, `${manifest.id}:${ECommands.SortMarkdownListAuto}`);
		expect(command).toBe(null);
	});
});
