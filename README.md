# Sort Markdown List

A simple and efficient Obsidian plugin to quickly sort your markdown lists. It sorts alphabetically based on the first word of each line, with advanced options available.

## ✨ Features

- Sort unordered lists alphabetically (A-Z or Z-A)
- Advanced sorting with grouping by initial letter
- Multi-language support (English, French)
- Seamless integration with the Obsidian interface

## ⚙️ Usage

1. Open the file that contains the list you want to sort.
2. Open the command palette (<kbd>Ctrl</kbd>+<kbd>P</kbd> or <kbd>Cmd</kbd>+<kbd>P</kbd>) and search for "Sort Markdown List".
3. Choose your preferred sorting option (ascending, descending, or advanced).
4. The list will be sorted instantly.

## 🔧 Examples
### Basic Sorting
- **Ascending**: Sorts the list items in alphabetical order (A-Z).
- **Descending**: Sorts the list items in reverse alphabetical order (Z-A).

### Advanced Sorting
Advanced sorting groups list items under a heading for their initial letter. For example, if you have a list like this:
```md
Introduction

- Banana: yellow
- Apple: green

Some text.

- Zebra: black and white
- Cat: furry
```
It will be sorted like this:
```md
Introduction

## A
- Apple: green
## B
- Banana: yellow

Some text.

## C
- Cat: furry
## Z
- Zebra: black and white
```

### Frontmatter Support
You can setup option in the frontmatter, allowing interaction with other plugins (i.e. Linter, Macros…) with using the `Sort based on frontmatter` command.

> [!TIP]
> The settings of the plugin allow to set the default values when no frontmatter keys are found.

The keys that are supported are:
- `sml_sort`: Sort the list based on the frontmatter key. The value can be `true` or `false`. Setting to `false` will disable the sorting. 
- `sml_descending` : Sort the list in descending order. The value can be `true` or `false`. 
- `sml_advanced`: Group each first word by their initial letter. The value can be `true` or `false`. 
- `sml_level` : The level of the heading to use for grouping. The value must be between 1 and 6, and must be a number. 



## 📥 Installation

- [ ] From Obsidian's community plugins
- [x] Using BRAT with `https://github.com/Mara-Li/obsidian-list-sort`
- [x] From the release page:
    - Download the latest release
    - Unzip `sort-markdown-list.zip` into your `.obsidian/plugins/` folder
    - In Obsidian settings, reload the plugin
    - Enable the plugin

## 🌍 Languages

- [x] English
- [x] French

To add a translation:
1. Fork the repository
2. Add the translation in the `src/i18n/locales` folder (e.g., `fr.json`).
    - You can get your locale language from Obsidian using [obsidian translation](https://github.com/obsidianmd/obsidian-translations) or with `<% tp.obsidian.moment.locale() %>`
    - Copy the content of [`en.json`](./src/i18n/locales/en.json) into the new file
    - Translate the content
3. Edit `i18n/i18next.ts`:
    - Add `import * as <lang> from "./locales/<lang>.json";`
    - Add to the `resource` section: `<lang>: {translation: <lang>}`

## 💬 Support & Contributions

For questions, suggestions, or bug reports, open an issue on [GitHub](https://github.com/Mara-Li/obsidian-list-sort/issues).

Contributions are welcome!



