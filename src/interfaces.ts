/** biome-ignore-all lint/style/useNamingConvention: pythonic frontmatter key */
export interface AlphaBulletSettings {
	sml_sort: boolean;
	sml_descending: boolean;
	sml_group: boolean;
	sml_level: number;
}

export const DEFAULT_SETTINGS: AlphaBulletSettings = {
	sml_sort: true,
	sml_descending: false,
	sml_group: false,
	sml_level: 1,
};

export enum ECommands {
	Ascending = "ascending",
	Descending = "descending",
	GroupFullAsc = "group-full-ascending",
	GroupFullDesc = "group-full-descending",
	AutoOnFrontmatter = "auto-on-frontmatter",
	GroupAscItemDesc = "group-asc-item-desc",
	GroupDescItemAsc = "group-desc-item-asc",
}
