/** biome-ignore-all lint/style/useNamingConvention: Pythonic frontmatter settings */
import i18next from "i18next";
import { Plugin, type TFile } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, type SortMarkdownListSettings } from "./interfaces";
import { Sorts } from "./sorts";

export default class SortMarkdownList extends Plugin {
	settings!: SortMarkdownListSettings;
	sorts!: Sorts;

	readFrontmatter(file: TFile): SortMarkdownListSettings {
		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontmatter) return this.settings;
		return {
			sml_sort: frontmatter.sml_sort ?? this.settings.sml_sort,
			sml_reverse: frontmatter.sml_reverse ?? this.settings.sml_reverse,
			sml_advanced: frontmatter.sml_advanced ?? this.settings.sml_advanced,
			sml_level: frontmatter.sml_level ?? this.settings.sml_level,
		};
	}

	async chooseCommands(file: TFile, options: SortMarkdownListSettings) {
		const content = await this.app.vault.read(file);
		const sort = new Sorts(options.sml_level);
		if (options.sml_advanced)
			return sort.replaceAlphaListWithTitleInMarkdown(content, options.sml_reverse);
		return sort.replaceAlphaListInMarkdown(content, options.sml_reverse);
	}

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
			name: "Alphabetical",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";

				if (!checking) {
					if (file && fileIsMarkdownOpened) {
						const content = await this.app.vault.read(file);
						const newContent = this.sorts.replaceAlphaListInMarkdown(content);
						await this.app.vault.modify(file, newContent);
					}
				}
			},
		});

		//command 2: Sort "advanced" with title as letter
		//TODO: Add settings tabs

		this.addCommand({
			id: "sort-markdown-list-advanced",
			name: "Advanced",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";

				if (!checking) {
					if (file && fileIsMarkdownOpened) {
						const content = await this.app.vault.read(file);
						const newContent = this.sorts.replaceAlphaListInMarkdown(content);
						await this.app.vault.modify(file, newContent);
					}
				}
			},
		});

		//command 3: sort reverse
		this.addCommand({
			id: "sort-markdown-list-reverse",
			name: "Reverse",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";

				if (!checking) {
					if (file && fileIsMarkdownOpened) {
						const content = await this.app.vault.read(file);
						const newContent = this.sorts.replaceAlphaListInMarkdown(content, true);
						await this.app.vault.modify(file, newContent);
					}
				}
			},
		});

		//command 4: sort reverse with title as letter
		this.addCommand({
			id: "sort-markdown-list-reverse-advanced",
			name: "Reverse Advanced",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";

				if (!checking) {
					if (file && fileIsMarkdownOpened) {
						const content = await this.app.vault.read(file);
						const newContent = this.sorts.replaceAlphaListInMarkdown(content, true);
						await this.app.vault.modify(file, newContent);
					}
				}
			},
		});

		//commands 5 : Auto sort based on frontmatter.
		this.addCommand({
			id: "sort-markdown-list-auto",
			name: "Sort based on frontmatter",
			//@ts-ignore
			checkCallback: async (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				const options = file ? this.readFrontmatter(file) : this.settings;
				if (!checking) {
					if (file && fileIsMarkdownOpened && options.sml_sort) {
						const newContent = await this.chooseCommands(file, options);
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
		this.sorts = new Sorts(this.settings.sml_level);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.sorts = new Sorts(this.settings.sml_level); //reload
	}
}
