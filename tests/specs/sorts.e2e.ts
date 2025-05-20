/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import { obsidianPage } from "wdio-obsidian-service";
import { addFrontmatter, createFixture, expecteds, testAllType } from ".";
import { ECommands } from "../../src/interfaces";

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
			sml_descending: true,
			sml_advanced: true,
			sml_level: 1,
		});
		//we should FAIL to execute the command in the command palette
		let error = false;
		try {
			await browser.executeObsidianCommand(ECommands.AutoOnFrontmatter);
		} catch (e) {
			error = true;
		}
		expect(error).toBe(true);
	});
});
