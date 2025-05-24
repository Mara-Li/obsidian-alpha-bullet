/** biome-ignore-all lint/style/useNamingConvention: pythonic frontmatter key */
export interface AlphaBulletFrontmatter {
	sml_sort: boolean;
	sml_descending: boolean;
	sml_glossary: boolean;
	sml_level: number;
	sml_glossary_desc: boolean;
}

export type AlphaBulletSettings = {
	editorMenu: {
		enabled: boolean;
		onlyFrontmatter: boolean;
	};
} & AlphaBulletFrontmatter;

export const DEFAULT_SETTINGS: AlphaBulletSettings = {
	sml_sort: true,
	sml_descending: false,
	sml_glossary: false,
	sml_level: 1,
	sml_glossary_desc: false,
	editorMenu: {
		enabled: true,
		onlyFrontmatter: false,
	},
};

export enum ECommands {
	Ascending = "ascending",
	Descending = "descending",
	GlossaryFullAsc = "glossary-full-ascending",
	GlossaryFullDesc = "glossary-full-descending",
	AutoOnFrontmatter = "auto-on-frontmatter",
	GlossaryAscItemsDesc = "glossary-asc-item-desc",
	GlossaryDescItemAsc = "glossary-desc-item-asc",
}
