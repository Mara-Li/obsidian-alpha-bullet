# AlphaBullet

**AlphaBullet** is a simple yet powerful Obsidian plugin that sorts your unordered markdown lists using **natural order sorting** — with optional grouping by the initial letter.

Whether you're organizing notes, inventories, glossaries, or worldbuilding content, keeping things neat and readable has never been easier.

## ✨ Features

- Sort unordered lists alphabetically using **natural order** (e.g., `item2` comes before `item10`)
- Sort in ascending (A → Z) or descending (Z → A) order
- Optionally group items under a heading based on their first letter (`## A`, `## B`, etc.)
- Supports YAML frontmatter for per-file auto-sorting
- Plugin-wide default settings available
- Multi-language support (English & French)

## ⚙️ How to Use

1. Open a note containing the list you want to sort.
2. Open the command palette (<kbd>Ctrl</kbd> / <kbd>Cmd</kbd> + <kbd>P</kbd>)
3. Search for “AlphaBullet”
4. Choose a command:
   - **Sort ascending**
   - **Sort descending**
   - **Create glossary**, with options:
     - Full ascending
     - Full descending
     - Ascending (groups descending, items ascending)
     - Descending (groups descending, items ascending)
   - **Sort based on frontmatter**
5. Your list will be instantly sorted!

> [!TIP]
> You can also use the editor context menu to sort a selected list!


## 🔍 Understanding "Grouping" and "Items" Sorting

AlphaBullet uses **natural order sorting**, which means values like `item2` are placed before `item10` (unlike strict ASCII sorting).

When grouping is enabled (`group: true`), items are organized under headings based on their initial letter:

```md
## A
- Apple
## B
- Banana
```

There are two levels of sorting:

1. **Group headings** (e.g., `## A`, `## B`) can be sorted in ascending or descending order.
2. **Items within each group** are also sorted alphabetically.

> 🧠 Tricky part: The `sml_glossary_desc` setting lets you sort groups in **descending** order while keeping items inside each group sorted **ascending**.
>
> This is useful when creating reverse glossaries or highlighting last-letter groups first while keeping internal coherence.

## 🛠 Frontmatter Configuration

You can configure sorting behavior directly in your note using YAML frontmatter:

```yaml
---
sml_sort: true              # Enable sorting
sml_descending: false       # Sort order: false = A→Z, true = Z→A
sml_group: true             # Enable grouping by first letter
sml_level: 2                # Heading level used for group titles (## = level 2)
sml_glossary_desc: false    # Sort groups descending, but items ascending
---
```

> 💡 You can also set these options globally via the plugin settings in Obsidian.

## 📦 Installation

- [ ] Coming soon to Obsidian’s Community Plugins
- [x] Available via [BRAT](https://github.com/TfTHacker/obsidian42-brat):
  `https://github.com/Mara-Li/obsidian-alpha-bullet`
- [x] Manual installation:
  1. Download the latest release
  2. Unzip the folder into `.obsidian/plugins/`
  3. Reload Obsidian and enable the plugin

## 🌐 Languages

- [x] English
- [x] French

Want to help translate?
1. Fork the repository
2. Add your translation to `src/i18n/locales/<lang>.json`
3. Register your locale in `i18n/i18next.ts`

> Use [obsidian-translations](https://github.com/obsidianmd/obsidian-translations) or `tp.obsidian.moment.locale()` to find your language code.

## 🙋 Support & Contributions

Found a bug? Have a feature request?  
Please open an issue or pull request on [GitHub](https://github.com/Mara-Li/obsidian-list-sort/issues).

> ✏️ English isn’t my native language — feel free to suggest improvements!
> But please use English for issues so others can follow along.

## ❤️ Credits

Huge thanks to [Jesse Hines](https://github.com/jesse-r-s-hines/wdio-obsidian-service) for the [wdio-obsidian-service](https://github.com/jesse-r-s-hines/wdio-obsidian-service), which allowed me to run automated tests in a real Obsidian vault — a dream come true for a QA engineer!
