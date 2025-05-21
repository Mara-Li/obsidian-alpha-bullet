/** biome-ignore-all lint/style/useNamingConvention: Pythonic frontmatter settings */
import i18next from "i18next";
import { Plugin, type TFile } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import {
	DEFAULT_SETTINGS,
	ECommands,
	type SortMarkdownListSettings,
} from "./interfaces";
import { Sorts } from "./sorts";
import { MarkdownListSortSettings } from "./settings";

export default class SortMarkdownList extends Plugin {
	settings!: SortMarkdownListSettings;
	sorts!: Sorts;

	private convertStrToBool(defaultValue: boolean, input?: unknown): boolean {
		if (typeof input === "boolean") return input;
		if (input == null) return defaultValue;
		const val = String(input).toLowerCase();
		if (["true", "1", "yes", "on"].includes(val)) return true;
		if (["false", "0", "no", "off"].includes(val)) return false;
		return defaultValue;
	}

	private levelNumber(defaultValue: number, val?: unknown): number {
		const num = Number(val);
		return isNaN(num) ? defaultValue : num;
	}

	readFrontmatter(file: TFile): SortMarkdownListSettings {
		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontmatter) return this.settings;
		return {
			sml_sort: this.convertStrToBool(
				this.settings.sml_sort,
				frontmatter.sml_sort,
			),
			sml_descending: this.convertStrToBool(
				this.settings.sml_descending,
				frontmatter.sml_descending,
			),
			sml_advanced: this.convertStrToBool(
				this.settings.sml_advanced,
				frontmatter.sml_advanced,
			),
			sml_level: this.levelNumber(
				this.settings.sml_level,
				frontmatter.sml_level,
			),
		};
	}

	async chooseCommands(file: TFile, options: SortMarkdownListSettings) {
		const content = await this.app.vault.read(file);
		const sort = new Sorts(options.sml_level);
		if (options.sml_advanced)
			return sort.replaceAlphaListWithTitleInMarkdown(
				content,
				options.sml_descending,
			);
		return sort.replaceAlphaListInMarkdown(content, options.sml_descending);
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
			id: ECommands.Ascending,
			name: i18next.t("commands.alphabetical"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.replaceAlphaListInMarkdown(content);
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
			id: ECommands.AdvancedAsc,
			name: i18next.t("commands.advancedAlpha"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.replaceAlphaListWithTitleInMarkdown(content);
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
			id: ECommands.descending,
			name: i18next.t("commands.reverse"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.replaceAlphaListInMarkdown(content, true);
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
			id: ECommands.AdvancedDesc,
			name: i18next.t("commands.reverseAdvanced"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.replaceAlphaListWithTitleInMarkdown(
								content,
								true,
							);
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
			id: ECommands.AutoOnFrontmatter,
			name: i18next.t("commands.auto"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				const options = file ? this.readFrontmatter(file) : this.settings;
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
