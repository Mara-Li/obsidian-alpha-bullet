/** biome-ignore-all lint/style/useNamingConvention: pythonic frontmatter key */
export interface AlphaBulletSettings {
	sml_sort: boolean;
	sml_descending: boolean;
	sml_advanced: boolean;
	sml_level: number;
}

export const DEFAULT_SETTINGS: AlphaBulletSettings = {
	sml_sort: true,
	sml_descending: false,
	sml_advanced: false,
	sml_level: 1,
};

export enum ECommands {
	Ascending = "ascending",
	Descending = "descending",
	AdvancedAsc = "advanced-ascending",
	AdvancedDesc = "reverse-advanced",
	AutoOnFrontmatter = "auto-on-frontmatter",
	ReverseGroupOnly = "reverse-advanced-group-only",
}
