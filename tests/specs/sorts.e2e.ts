/** biome-ignore-all lint/style/useNamingConvention: snake case for frontmatter */

import { obsidianPage } from "wdio-obsidian-service";
import {
	expecteds,
	fixtures,
	generatedFm,
	manifest,
	stringifyFrontmatter,
	type Options,
	normalize,
} from "./helper";
import { ECommands } from "../../src/interfaces";
import path from "node:path";
import fs from "node:fs";
import type AlphaBullet from "../../src/main";

export function expectMarkdownEqual(received: string, expected: string) {
	expect(normalize(received)).toBe(normalize(expected));
}

async function createFixture(fixtureName: string, frontmatter?: Options) {
	const fixtureContent = fs.readFileSync(path.join(fixtures, fixtureName), "utf-8");
	const frontmatterContent = stringifyFrontmatter(frontmatter);
	await browser.executeObsidian(
		async ({ app }, content, fileName, fm) => {
			if (fm) content = `${fm}${content}`;
			await app.vault.create(fileName, content);
		},
		fixtureContent,
		fixtureName,
		frontmatterContent
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

async function runTestWithFixture(
	fixtureName: string,
	command: ECommands,
	frontmatter?: Options
) {
	await createFixture(fixtureName, frontmatter);
	await browser.executeObsidianCommand(`${manifest.id}:${command}`);
	const res = await browser.executeObsidian(async ({ app, obsidian }, fileName) => {
		const file = app.vault.getAbstractFileByPath(fileName);
		if (file && file instanceof obsidian.TFile) {
			return await app.vault.read(file);
		}
		return "";
	}, fixtureName);
	return res;
}

describe("Commands test", () => {
	beforeEach(async function () {
		await obsidianPage.resetVault();
		//set the default value for the settings
		const plug = await browser.executeObsidian(
			async ({ app }, manifest: Record<string, string>) => {
				const plugin = app.plugins.getPlugin(manifest.id) as AlphaBullet;
				if (plugin) {
					plugin.settings.sml_level = 2;
					await plugin.saveSettings();
					return plugin?.settings;
				}
				return null;
			},
			manifest
		);
		expect(plug).not.toBeNull();
		expect(plug?.sml_level).toBe(2);
	});
	for (const item of expecteds) {
		describe(item.fileName, () => {
			it("sort ascending (A-Z)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(item.fileName, ECommands.Ascending);
				expectMarkdownEqual(result, expectedFm.ascending);
			});
			it("group sort - ASC (A-Z)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(item.fileName, ECommands.GroupFullAsc);
				expectMarkdownEqual(result, expectedFm.group.ascending);
			});
			it("sort descending (Z-A)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(item.fileName, ECommands.Descending);
				expectMarkdownEqual(result, expectedFm.descending);
			});
			it("Sort group desc (Z-A)", async () => {
				const expectedFm = generatedFm(item.expected);
				const result = await runTestWithFixture(item.fileName, ECommands.GroupFullDesc);
				expectMarkdownEqual(result, expectedFm.group.descending);
			});
		});
	}
});
