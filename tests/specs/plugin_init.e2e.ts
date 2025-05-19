import { browser, expect } from "@wdio/globals";
import { obsidianPage } from "wdio-obsidian-service";
import * as fs from "fs";
import * as path from "path";

const manifest = JSON.parse(
	fs.readFileSync(`${path.resolve(__dirname, "..", "..", "manifest.json")}`, "utf-8")
) as { id: string; name: string; version: string };

console.log(
	`Running tests for ${manifest.name} v${manifest.version} in ${process.env.VAULT}`
);

describe("Test my plugin", function () {
	beforeEach(async function () {
		await obsidianPage.resetVault();
	});
	it("plugins should be loaded", async function () {
		// Check if the plugin is loaded in the vault
		const pluginIsLoaded = await browser.executeObsidian(
			({ app, obsidian }, pluginId) => {
				return app.plugins.getPlugin(pluginId)?._loaded;
			},
			manifest.id
		);
		expect(pluginIsLoaded).toBe(true);
	});

	it("List all files in the vault", async function () {
		// List all files in the vault
		const files = await browser.executeObsidian(({ app }) => {
			return app.vault.getMarkdownFiles().map((file) => file.path);
		});
		console.warn(`Files in the vault: ${files}`);
		expect(files.some((file) => file.match(/(welcome|bienvenue)\.md$/i))).toBe(true);
	});
});
