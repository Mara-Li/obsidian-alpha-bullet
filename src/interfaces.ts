/** biome-ignore-all lint/style/useNamingConvention: pythonic frontmatter key */
export interface SortMarkdownListSettings {
	sml_sort: boolean;
	sml_reverse: boolean;
	sml_advanced: boolean;
	sml_level: number;
}

export const DEFAULT_SETTINGS: SortMarkdownListSettings = {
	sml_sort: true,
	sml_reverse: false,
	sml_advanced: false,
	sml_level: 1,
};

export enum ECommands {
	Alphabetical = "alphabetical",
	Reverse = "reverse",
	AdvancedAlpha = "advanced-alphabetical",
	AdvancedReverse = "reverse-advanced",
	AutoOnFrontmatter = "auto-on-frontmatter",
}
