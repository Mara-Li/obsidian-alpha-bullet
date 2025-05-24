import i18next from "i18next";
import { type App, PluginSettingTab, Setting, sanitizeHTMLToDom } from "obsidian";
import type { AlphaBulletSettings } from "./interfaces";
import type AlphaBullet from "./main";

export class MarkdownListSortSettings extends PluginSettingTab {
	plugin: AlphaBullet;
	settings: AlphaBulletSettings;

	constructor(app: App, plugin: AlphaBullet) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass("alpha-bullet");

		new Setting(containerEl)
			.setName(i18next.t("enableMenu.title"))
			.setDesc(i18next.t("enableMenu.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.editorMenu.enabled).onChange(async (value) => {
					this.settings.editorMenu.enabled = value;
					await this.plugin.saveSettings();
					await this.display();
				})
			);

		if (this.settings.editorMenu.enabled) {
			new Setting(containerEl)
				.setClass("p-4")
				.setName(i18next.t("enableMenu.onlyFrontmatter.title"))
				.setDesc(
					sanitizeHTMLToDom(
						i18next.t("enableMenu.onlyFrontmatter.desc", {
							// biome-ignore lint/style/useNamingConvention: frontmatter key in translation
							sml_sort: "<code>sml_sort</code>",
							value: "<code>true</code>",
						})
					)
				)
				.addToggle((toggle) =>
					toggle
						.setValue(this.settings.editorMenu.onlyFrontmatter)
						.onChange(async (value) => {
							this.settings.editorMenu.onlyFrontmatter = value;
							await this.plugin.saveSettings();
						})
				);
		}

		new Setting(containerEl)
			.setName(i18next.t("frontmatter"))
			.setHeading()
			.setDesc(`${i18next.t("settings.description")}`);

		new Setting(containerEl)
			.setClass("p-4")
			.setName(sanitizeHTMLToDom(`${i18next.t("level")} (<code>sml_level</code>)`))
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.level.desc")}`))
			.addSlider((slider) =>
				slider
					.setValue(this.settings.sml_level)
					.setLimits(1, 6, 1)
					.onChange(async (value) => {
						this.settings.sml_level = value;
						await this.plugin.saveSettings();
					})
					.setDynamicTooltip()
			);

		new Setting(containerEl)
			.setClass("p-4")

			.setName(sanitizeHTMLToDom(`${i18next.t("sort")} (<code>sml_sort</code>)`))
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.disable.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_sort).onChange(async (value) => {
					this.settings.sml_sort = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setClass("p-4")

			.setName(sanitizeHTMLToDom(`${i18next.t("reverse")} <code>(sml_descending)</code>`))
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.descending.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_descending).onChange(async (value) => {
					this.settings.sml_descending = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setClass("p-4")

			.setName(
				sanitizeHTMLToDom(
					`${i18next.t("settings.glossary.title")} (<code>sml_glossary</code>)`
				)
			)
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.glossary.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_glossary).onChange(async (value) => {
					this.settings.sml_glossary = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setClass("p-4")

			.setName(
				sanitizeHTMLToDom(`${i18next.t("items")} (<code>sml_glossary_reverse</code>)`)
			)
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.items.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_glossary_desc).onChange(async (value) => {
					this.settings.sml_glossary_desc = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
