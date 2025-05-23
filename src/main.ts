/** biome-ignore-all lint/style/useNamingConvention: Pythonic frontmatter settings */
import i18next from "i18next";
import { Plugin, type TFile } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, ECommands, type AlphaBulletSettings } from "./interfaces";
import { BulletSort } from "./sorts";
import { MarkdownListSortSettings } from "./settings";

export default class AlphaBullet extends Plugin {
	settings!: AlphaBulletSettings;
	sorts!: BulletSort;

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

	readFrontmatter(file: TFile): AlphaBulletSettings {
		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontmatter) return this.settings;
		return {
			sml_sort: this.convertStrToBool(this.settings.sml_sort, frontmatter.sml_sort),
			sml_descending: this.convertStrToBool(
				this.settings.sml_descending,
				frontmatter.sml_descending
			),
			sml_group: this.convertStrToBool(this.settings.sml_group, frontmatter.sml_group),
			sml_level: this.levelNumber(this.settings.sml_level, frontmatter.sml_level),
		};
	}

	async chooseCommands(file: TFile, options: AlphaBulletSettings) {
		const content = await this.app.vault.read(file);
		const sort = new BulletSort(options.sml_level);
		if (options.sml_group) return sort.cleanSortByGroup(content, options.sml_descending);
		return sort.cleanSort(content, options.sml_descending);
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
							return this.sorts.cleanSort(content);
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

		//command 2: Sort "group" with title as letter - ASC
		this.addCommand({
			id: ECommands.GroupFullAsc,
			name: i18next.t("commands.groupAlpha"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.cleanSortByGroup(content, false, false);
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

		//command 3: sort reverse
		this.addCommand({
			id: ECommands.Descending,
			name: i18next.t("commands.reverse"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.cleanSort(content, true);
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

		//command 4: Full reverse with title as letter
		this.addCommand({
			id: ECommands.GroupFullDesc,
			name: i18next.t("commands.reverseGroup"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.cleanSortByGroup(content, true, true);
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

		//command 6: group ASC Letters - DESC Items
		this.addCommand({
			id: ECommands.GroupAscItemDesc,
			name: i18next.t("commands.groupAscItemDesc"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.cleanSortByGroup(content, false, true);
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
		this.sorts = new BulletSort(this.settings.sml_level);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.sorts = new BulletSort(this.settings.sml_level); //reload
	}
}
