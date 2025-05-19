import { type App, MarkdownRenderer, PluginSettingTab, Setting } from "obsidian";
import type { SortMarkdownListSettings } from "./interfaces";
import type SortMarkdownList from "./main";
import dedent from "dedent";

export class MarkdownListSortSettings extends PluginSettingTab {
	plugin: SortMarkdownList;
	settings: SortMarkdownListSettings;

	constructor(app: App, plugin: SortMarkdownList) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		const markdownDesc = dedent(`
		The frontmatter allows to use automatically the right commands based on the frontmatter. Conveniant when used with the linter plugin and other macros.
		
		<u>Keys</u>:
		- \`sml_reverse\` *(\`boolean\`)* : Reverse the order of the sort (Z-A)
		- \`sml_advanced\` *(\`boolean\`)*: Use the advanced sort (each letter will be a heading)
		- \`sml_level\` *(\`number\`)* : Heading level for the advanced sort (1-6)
		- \`sml_sort\` *(\`boolean\`)* : Disable the command (can be forced using other commands)
		`);

		await MarkdownRenderer.render(this.app, markdownDesc, containerEl, "", this.plugin);

		new Setting(containerEl)
			.setName("Heading level")
			.addSlider((slider) =>
				slider.setValue(this.settings.sml_level).setLimits(1, 6, 1).setDynamicTooltip()
			);

		new Setting(containerEl).setName("Sort").addToggle((toggle) =>
			toggle.setValue(this.settings.sml_sort).onChange(async (value) => {
				this.settings.sml_sort = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl).setName("Reverse").addToggle((toggle) =>
			toggle.setValue(this.settings.sml_reverse).onChange(async (value) => {
				this.settings.sml_reverse = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl).setName("Advanced").addToggle((toggle) =>
			toggle.setValue(this.settings.sml_advanced).onChange(async (value) => {
				this.settings.sml_advanced = value;
				await this.plugin.saveSettings();
			})
		);
	}
}
