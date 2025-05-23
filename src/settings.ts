import {
	type App,
	MarkdownRenderer,
	PluginSettingTab,
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

		const markdownDesc = dedent(`${i18next.t("settings.description")}
		
		<u>${i18next.t("keys")}</u>:
		- \`sml_descending\` *(\`boolean\`)* : ${i18next.t("settings.reverse")}
		- \`sml_advanced\` *(\`boolean\`)*: ${i18next.t("settings.advanced")}
		- \`sml_level\` *(\`number\`)* : ${i18next.t("settings.level")}
		- \`sml_sort\` *(\`boolean\`)* : ${i18next.t("settings.disable")}
		- \`sml_advanced_group_only\` *(\`boolean\`)*: `);

		await MarkdownRenderer.render(
			this.app,
			markdownDesc,
			containerEl,
			"",
			this.plugin,
		);

		new Setting(containerEl)
			.setName(`${i18next.t("level")}`)
			.addSlider((slider) =>
				slider
					.setValue(this.settings.sml_level)
					.setLimits(1, 6, 1)
					.onChange(async (value) => {
						this.settings.sml_level = value;
						await this.plugin.saveSettings();
					})
					.setDynamicTooltip(),
			);

		new Setting(containerEl)
			.setName(`${i18next.t("sort")}`)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_sort).onChange(async (value) => {
					this.settings.sml_sort = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName(`${i18next.t("reverse")}`)
			.addToggle((toggle) =>
				toggle
					.setValue(this.settings.sml_descending)
					.onChange(async (value) => {
						this.settings.sml_descending = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(`${i18next.t("advanced")}`)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.sml_advanced).onChange(async (value) => {
					this.settings.sml_advanced = value;
					await this.plugin.saveSettings();
				}),
			);
	}
}
