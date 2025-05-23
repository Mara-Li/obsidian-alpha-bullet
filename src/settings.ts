import {
	type App,
	MarkdownRenderer,
	PluginSettingTab,
	sanitizeHTMLToDom,
	Setting,
} from "obsidian";
import type { AlphaBulletSettings } from "./interfaces";
import type AlphaBullet from "./main";
import dedent from "dedent";
import i18next from "i18next";

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

		const markdownDesc = dedent(`${i18next.t("settings.description")}`);

		await MarkdownRenderer.render(this.app, markdownDesc, containerEl, "", this.plugin);

		new Setting(containerEl)
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
			.setName(sanitizeHTMLToDom(`${i18next.t("sort")} (<code>sml_sort</code>)`))
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.disable.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_sort).onChange(async (value) => {
					this.settings.sml_sort = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(sanitizeHTMLToDom(`${i18next.t("reverse")} <code>(sml_descending)</code>`))
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.descending.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_descending).onChange(async (value) => {
					this.settings.sml_descending = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
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
			.setName(
				sanitizeHTMLToDom(`${i18next.t("items")} (<code>sml_glossary_reverse</code>)`)
			)
			.setDesc(sanitizeHTMLToDom(`${i18next.t("settings.items.desc")}`))
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_glossary_reverse).onChange(async (value) => {
					this.settings.sml_glossary_reverse = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
