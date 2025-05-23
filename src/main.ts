/** biome-ignore-all lint/style/useNamingConvention: Pythonic frontmatter settings */
import i18next from "i18next";
import { Plugin, TFile } from "obsidian";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, ECommands, type AlphaBulletSettings } from "./interfaces";
import { MarkdownListSortSettings } from "./settings";
import { BulletSort } from "./sorts";

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
			sml_glossary: this.convertStrToBool(
				this.settings.sml_glossary,
				frontmatter.sml_glossary
			),
			sml_level: this.levelNumber(this.settings.sml_level, frontmatter.sml_level),
			sml_items_desc: this.convertStrToBool(
				this.settings.sml_items_desc,
				frontmatter.sml_items_desc
			),
		};
	}

	private async chooseCommands(file: TFile | string, options: AlphaBulletSettings) {
		const content = file instanceof TFile ? await this.app.vault.read(file) : file;
		const sort = new BulletSort(options.sml_level);
		if (options.sml_glossary)
			return sort.cleanSortByGroup(
				content,
				options.sml_descending,
				options.sml_items_desc
			);
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
			id: ECommands.GlossaryFullAsc,
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
			id: ECommands.GlossaryFullDesc,
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
			id: ECommands.GlossaryAscItemsDesc,
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

		//command 7: group DESC Letters - ASC Items
		this.addCommand({
			id: ECommands.GlossaryDescItemAsc,
			name: i18next.t("commands.groupDescItemAsc"),
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				const fileIsMarkdownOpened = file?.extension === "md";
				if (file && fileIsMarkdownOpened) {
					if (!checking) {
						const content = this.app.vault.read(file).then((content) => {
							return this.sorts.cleanSortByGroup(content, true, false);
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

		//sort on selection in editor + right click
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				if (view.file?.extension !== "md") return;
				const options = this.readFrontmatter(view.file);
				const selection = editor.getSelection();
				//if no selection or not a list, return
				if (!selection || !this.sorts.isList(selection)) return;
				menu.addItem((item) => {
					item.setTitle(i18next.t("menu.sortSelection"));
					item.setIcon("arrow-down-up");
					const subMenu = item.setSubmenu();
					subMenu.addItem((sub) => {
						sub.setTitle(i18next.t("menu.auto"));
						sub.onClick(async () => {
							const selectedText = editor.getSelection();
							if (selectedText) {
								const newContent = await this.chooseCommands(selectedText, options);
								editor.replaceSelection(newContent);
							}
						});
					});
					subMenu.addItem((sub) => {
						sub.setTitle(i18next.t("menu.desc"));
						sub.onClick(async () => {
							const content = this.sorts.cleanSort(selection, true);
							editor.replaceSelection(content);
						});
					});
					subMenu.addItem((sub) => {
						sub.setTitle(i18next.t("menu.asc"));
						sub.onClick(async () => {
							const content = this.sorts.cleanSort(selection, false);
							editor.replaceSelection(content);
						});
					});
				});
				menu.addItem((item) => {
					const subMenu = item.setSubmenu();
					item.setTitle(i18next.t("menu.group"));
					subMenu.addItem((sub) => {
						sub.setTitle(i18next.t("menu.asc"));
						sub.onClick(async () => {
							const content = this.sorts.cleanSortByGroup(selection, false);
							editor.replaceSelection(content);
						});
					});
					subMenu.addItem((sub) => {
						sub.setTitle(i18next.t("menu.desc"));
						sub.onClick(async () => {
							const content = this.sorts.cleanSortByGroup(selection, true);
							editor.replaceSelection(content);
						});
					});
				});
			})
		);
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
