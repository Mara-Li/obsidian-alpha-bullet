# AlphaBullet

**AlphaBullet** is a simple yet powerful Obsidian plugin that lets you sort your unordered markdown lists alphabetically — with optional grouping by initial letter.

Whether you're managing notes, inventories, or worldbuilding content, keeping things clean and organized has never been easier.

## ✨ Features

- Sort unordered lists alphabetically (A-Z or Z-A)
- Optional grouping by first letter (`## A`, `## B`, etc.)
- Supports Obsidian frontmatter for auto-sorting per file
- Multi-language support (English & French)


## ⚙️ How to Use

1. Open the note containing the list you want to sort.
2. Open the command palette (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>P</kbd>)
3. Search for “AlphaBullet”
4. Choose one of the available commands:
   - **Sort ascending**
   - **Sort descending**
   - **Advanced sort (with letter headers)**
   - **Sort based on frontmatter**
5. Your list is instantly sorted!

## 🔧 Commands

### Basic Sorting
- **Ascending**: A → Z
- **Descending**: Z → A

### Advanced Sorting
Group items under a heading based on their initial letter.

**Example:**
Before:
```md
Introduction

- Banana: yellow
- Apple: green

Some text.

- Zebra: black and white
- Cat: furry
````

After:

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

## 🛠 Frontmatter Support

You can configure how lists are sorted using YAML frontmatter in your notes.
This allows seamless integration with other tools like Linter, Macros, Dataview, etc.

**Example:**

```yaml
---
sml_sort: true
sml_descending: false
sml_advanced: true
sml_level: 2
---
```

**Available keys:**

* `sml_sort`: Enable/disable sorting
* `sml_descending`: Reverse sort order
* `sml_advanced`: Group items by letter
* `sml_level`: Heading level (1 to 6)

> [!TIP]
> You can also define default behavior globally in the plugin settings.

## 📦 Installation

* [ ] Available via Obsidian’s Community Plugins (coming soon)
* [x] Via [BRAT](https://github.com/TfTHacker/obsidian42-brat) using:
  `https://github.com/Mara-Li/obsidian-alpha-bullet`
* [x] Manual install:
  1. Download the latest release
  2. Unzip the `alpha-bullet.zip` to your `.obsidian/plugins/` folder
  3. Reload Obsidian and enable the plugin in settings

## 🌐 Languages

* [x] English
* [x] French

Want to help translate? Here’s how:
1. Fork the repo
2. Add your translation in `src/i18n/locales/<lang>.json`
3. Edit `i18n/i18next.ts` to import and register the new locale

> Use [obsidian-translations](https://github.com/obsidianmd/obsidian-translations) or `tp.obsidian.moment.locale()` to find your language code.

## 🙋 Support & Contributions

Found a bug? Want a new feature?
Open an issue or pull request on [GitHub](https://github.com/Mara-Li/obsidian-list-sort/issues).

> [!NOTE]
> English is not my native language — feel free to correct mistakes!
> However, please submit issues in English so everyone can benefit from the discussion.

## ❤️ Credits & Thanks

Special thanks to [Jesse Hines](https://github.com/jesse-r-s-hines/wdio-obsidian-service) for the [wdio-obsidian-service](https://github.com/jesse-r-s-hines/wdio-obsidian-service), which allowed me to test this plugin inside a real Obsidian vault — a dream come true for a QA engineer like me!


