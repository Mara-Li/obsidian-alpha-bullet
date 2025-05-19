import i18next from "i18next";
import { Plugin } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, type SortMarkdownListSettings } from "./interfaces";
import { replaceAlphaListInMarkdown } from "./sorts";

export default class SortMarkdownList extends Plugin {
	settings!: SortMarkdownListSettings;

	async onload() {
		console.log(`[${this.manifest.name}] Loaded`);
		await this.loadSettings();
		//load i18next
		await i18next.init({
			lng: translationLanguage,
			fallbackLng: "en",
			resources,
			returnNull: false,
			returnEmptyString: false,
		});

		//commands 1 : Sort entire content alpha 'simple'
		this.addCommand({
			id: "sort-markdown-list",
			name: "Sort Markdown list - Alphabetical",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";

				if (!checking) {
					if (file && fileIsMarkdownOpened) {
						const content = await this.app.vault.read(file);
						const newContent = replaceAlphaListInMarkdown(content);
						await this.app.vault.modify(file, newContent);
					}
				}
			},
		});
	}

	onunload() {
		console.log(`[${this.manifest.name}] Unloaded`);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
