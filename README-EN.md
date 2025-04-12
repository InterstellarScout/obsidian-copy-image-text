# Copy Image Text

Copy Image Text is an Obsidian plugin that allows users to copy note content (including text and images) to the clipboard while preserving formatting.

## Features

- Supports two copy modes:
  - Copy text and images (rich text format): Suitable for Word, WeChat public account editors, etc.
  - Copy as Markdown format: Suitable for other Markdown editors
- Automatically converts Obsidian images to inline base64 format (rich text mode) or standard Markdown image links (Markdown mode)
- Preserves Markdown formatting, including headings, bold, italics, code blocks, etc.
- Specially optimized for display in WeChat public account editors

## Usage

1. Open a note in Obsidian.
2. Select the text you want to copy (if no text is selected, the entire document will be copied).
3. Use the command palette to execute one of the following commands:
   - **Copy Text and Images (Rich Text)**: Copies content as rich text.
   - **Copy as Markdown Format**: Copies content as standard Markdown.
4. Paste the content into your target application.

*Tip: You can assign hotkeys for these commands in Obsidian Settings under "Hotkeys" for more convenient use.*

## Installation

1. Open Obsidian Settings.
2. Navigate to the "Third-party plugins" settings page.
3. Ensure that "Safe mode" is turned off.
4. Click on "Browse community plugins."
5. Search for "Copy Image Text."
6. Click "Install."
7. Once installed, enable the plugin.

## Development Notes

This plugin is developed using TypeScript. To contribute:

1. After cloning the repository, run `npm install` to install dependencies.
2. After modifying the TypeScript source code, run `npm run build` to compile.
3. The compiled `main.js` file is not tracked in version control but must be manually included in releases.

*Note: When publishing a new version, be sure to run `npm run build` first, then include the generated `main.js` file in the release package.*

## Notes

- The image size is limited to 10MB; images exceeding this size will not be copied.
- Some special formatting may not be fully preserved in certain target applications.
- Please ensure you have the rights to copy and share any images contained in your notes.
- **Markdown Format Copy Tips:**
  - If you plan to publish your document on GitHub or a blog platform, consider the following steps:
    1. Use an editor that supports image bed uploads (for example, Typora + PicList).
    2. Upload the images in your document to an image bed (this has been tested in Typora).
    3. The images will then become online links.
    4. You can then simply copy the entire document, as all images are now online links.
  - Obsidian may also have image bed upload plugins available (untested).

## Feedback and Support

If you encounter any issues or have suggestions for improvement, please raise an issue in the GitHub repository.

## License

This plugin is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed and maintained by msgk.

## Version

Current version: 1.0.7