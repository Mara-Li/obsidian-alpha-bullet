import { obsidianPage } from "wdio-obsidian-service";
import { createFixture } from "./sorts.e2e";
import { ECommands } from "../../src/interfaces";

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
