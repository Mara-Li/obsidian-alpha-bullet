/** biome-ignore-all lint/style/useNamingConvention: Pythonic frontmatter settings */
import i18next from "i18next";
import { Plugin, type TFile } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, type SortMarkdownListSettings } from "./interfaces";
import { Sorts } from "./sorts";
import { MarkdownListSortSettings } from "./settings";

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
			return sort.replaceAlphaListWithTitleInMarkdown(
				content,
				options.sml_reverse,
			);
		return sort.replaceAlphaListInMarkdown(content, options.sml_reverse);
	}

	async onload() {
		console.log(`[${this.manifest.name}] Loaded`);
		await this.loadSettings();
		this.addSettingTab(new MarkdownListSortSettings(this.app, this));

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
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							const newContent = this.sorts.replaceAlphaListInMarkdown(content);
							return newContent;
						});
						content.then((content) => {
							this.app.vault.modify(file, content);
						});
					}
					return true;
				}
				return false;
			},
		});

		//command 2: Sort "advanced" with title as letter
		this.addCommand({
			id: "sort-markdown-list-advanced",
			name: "Advanced",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							const newContent =
								this.sorts.replaceAlphaListWithTitleInMarkdown(content);
							return newContent;
						});
						content.then((content) => {
							const newContent = this.sorts.replaceAlphaListInMarkdown(content);
							this.app.vault.modify(file, newContent);
						});
					}
					return true;
				}
				return false;
			},
		});

		//command 3: sort reverse
		this.addCommand({
			id: "sort-markdown-list-reverse",
			name: "Reverse",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							const newContent = this.sorts.replaceAlphaListInMarkdown(
								content,
								true,
							);
							return newContent;
						});
						content.then((content) => {
							this.app.vault.modify(file, content);
						});
					}
					return true;
				}
				return false;
			},
		});

		//command 4: sort reverse with title as letter
		this.addCommand({
			id: "sort-markdown-list-reverse-advanced",
			name: "Reverse Advanced",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							const newContent = this.sorts.replaceAlphaListInMarkdown(
								content,
								true,
							);
							return newContent;
						});
						content.then((content) => {
							this.app.vault.modify(file, content);
						});
					}
					return true;
				}
				return false;
			},
		});

		//commands 5 : Auto sort based on frontmatter.
		this.addCommand({
			id: "sort-markdown-list-auto",
			name: "Sort based on frontmatter",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				const options = file ? this.readFrontmatter(file) : this.settings;
				console.log(
					"options",
					file && fileIsMarkdownOpened && options.sml_sort,
				);
				if (file && fileIsMarkdownOpened && options.sml_sort) {
					if (!checking) {
						const newContent = this.chooseCommands(file, options);
						newContent.then((content) => {
							this.app.vault.modify(file, content);
						});
					}
					return true;
				}
				return false;
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
