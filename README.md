# Copy Note's Text and Images
Copy Image Text is an Obsidian plugin that allows users to copy note content (including text and images) to the clipboard while preserving formatting.

## Features
- Supports two copy modes:
  - Copy text and images (rich text format): Ideal for pasting into rich text editors such as Microsoft Word or WeChat public account editors.
  - Copy as Markdown format: Ideal for pasting into other Markdown editors.
- Automatically converts Obsidian image embeds into inline base64 images (rich text mode) or standard Markdown image links (Markdown mode).
- Retains Markdown formatting including headings, bold, italics, code blocks, etc.
- Specially optimized for display in WeChat public account editors.

## Installation
1. Open Obsidian Settings.
2. Go to the "Third-party plugins" settings page.
3. Ensure that "Safe mode" is turned off.
4. Click on "Browse community plugins."
5. Search for "Copy Image Text."
6. Click "Install."
7. Once installation is complete, enable the plugin.

## Usage
1. Open a note in Obsidian.
2. Select the text you want to copy (if no text is selected, the entire document will be copied).
3. Execute one of the following commands from the command palette:
   - **Copy Text and Images (Rich Text)**: Copies as rich text format.
   - **Copy as Markdown Format**: Copies as standard Markdown format.
4. Paste the copied content into your target application.

*Tip: You can assign hotkeys for these commands in Obsidian Settings under "Hotkeys" for more convenient use.*

## Development Notes
This plugin is developed using TypeScript. To contribute:

1. After cloning the repository, run `npm install` to install dependencies.
2. After modifying the TypeScript source code, run `npm run build` to compile.
3. The compiled `main.js` file is not tracked in version control but must be manually included in releases.

*Note: Before publishing a new version, run `npm run build` and then add the generated `main.js` file to the release package.*

## Notes
- Images are limited to a maximum of 10MB. Images exceeding this size will not be copied.
- Some special formatting may not be fully preserved in certain target applications.
- Ensure you have the right to copy and share images contained in your notes.
- **Markdown Format Copy Tips:**
  - If you plan to publish your document on GitHub or a blog platform, consider the following:
    1. Use an editor that supports image bed uploads (e.g., Typora with PicList).
    2. Upload the images in your document to an image bed (this has been tested in Typora).
    3. The images will then convert to online links.
    4. You can then copy the entire document, and all images will be online links.
  - Obsidian may also have plugins available for image bed uploads (untested).

## Feedback and Support
If you encounter any issues or have suggestions for improvement, please raise an issue in the GitHub repository.

## License
This plugin is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author
Developed and maintained by msgk.

## Version
Current version: 1.0.7
