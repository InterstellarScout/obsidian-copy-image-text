import { Editor, MarkdownView, Notice, Plugin, TFile, arrayBufferToBase64, Vault } from 'obsidian';

export default class CopyImageTextPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'copy-text',
      name: 'Copy Text and Images (Rich Text)',
      editorCallback: (editor: Editor, view: MarkdownView) => this.copyTextAndImages(editor, view)
    });

    this.addCommand({
      id: 'copy-markdown',
      name: 'Copy as Markdown Format',
      editorCallback: (editor: Editor, view: MarkdownView) => this.copyAsMarkdown(editor, view)
    });
  }

  async copyTextAndImages(editor: Editor, view: MarkdownView) {
    try {
      let content = editor.getSelection() || editor.getValue();

      if (!view.file) {
        new Notice('Unable to retrieve current file information, copying may be incomplete');
        return;
      }

      const htmlContent = await this.convertToHtml(content, view.file);

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([content], { type: 'text/plain' })
        })
      ]);

      new Notice('Content copied successfully');
    } catch (error) {
      new Notice('Copy failed, please try again later');
    }
  }

  async copyAsMarkdown(editor: Editor, view: MarkdownView) {
    try {
      let content = editor.getSelection() || editor.getValue();

      if (!view.file) {
        new Notice('Unable to retrieve current file information, copying may be incomplete');
        return;
      }

      content = await this.replaceImageLinks(content, view.file);

      await navigator.clipboard.writeText(content);
      new Notice('Markdown format copied');
    } catch (error) {
      new Notice('Copy failed, please try again later');
    }
  }

  async replaceImageLinks(content: string, file: TFile): Promise<string> {
    const imageRegex = /!\[\[(.*?)\]\]/g;
    let result = content;

    for (const match of content.matchAll(imageRegex)) {
      const imagePath = match[1];
      const imageFile = this.app.vault.getFiles().find(f =>
        f.name.toLowerCase().includes(imagePath.split('/').pop()?.toLowerCase() || '')
      );

      if (imageFile) {
        let absolutePath = this.app.vault.getResourcePath(imageFile)
          .replace(/^app:\/\/.*?\//, '')
          .replace(/\?.*$/, '')
          .replace(/\\/g, '/');

        absolutePath = decodeURI(absolutePath);

        const fileUrl = 'file:///' + absolutePath;

        result = result.replace(
          `![[${imagePath}]]`,
          `![${imagePath}](${fileUrl})`
        );
      }
    }

    return result;
  }

  async convertToHtml(content: string, file: TFile): Promise<string> {
    const imageRegex = /!\[\[(.*?)\]\]/g;
    const replacements = await Promise.all(Array.from(content.matchAll(imageRegex)).map(
      match => this.replaceImageWithBase64(match[1], file)
    ));

    let htmlContent = content;
    replacements.forEach(({ original, replacement }) => {
      htmlContent = htmlContent.replace(original, replacement);
    });

    // Process horizontal rules
    htmlContent = htmlContent.replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">');

    // Process code blocks
    htmlContent = htmlContent.replace(/```([\s\S]*?)```/g, (match, code) => {
      const escapedCode = this.escapeHtml(code.trim());
      return `<pre style="background-color: #f6f8fa; border-radius: 3px; padding: 16px; overflow: auto;"><code style="font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; font-size: 14px; line-height: 1.5;">${escapedCode}</code></pre>`;
    });

    // Process headings
    htmlContent = htmlContent.replace(/^(#+)\s+(.*?)$/gm, (match, hashes, title) => {
      const level = hashes.length;
      const fontSize = 28 - (level * 2);
      return `<h${level} style="font-size: ${fontSize}px; font-weight: bold; margin: 10px 0;">${title}</h${level}>`;
    });

    // Other Markdown to HTML conversion
    htmlContent = htmlContent
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #576b95; text-decoration: none;">$1</a>');

    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #333; line-height: 1.6;">${htmlContent}</div>`;
  }

  async replaceImageWithBase64(imagePath: string, file: TFile): Promise<{ original: string, replacement: string }> {
    try {
      const fileName = imagePath.split('/').pop() || imagePath;
      const imageFile = this.app.vault.getFiles().find(f =>
        f.name.toLowerCase().includes(fileName.toLowerCase())
      );

      if (!imageFile) {
        return { original: `![[${imagePath}]]`, replacement: `[Image not found: ${imagePath}]` };
      }

      const stat = await this.app.vault.adapter.stat(imageFile.path);
      if (stat && stat.size > 10 * 1024 * 1024) {
        return { original: `![[${imagePath}]]`, replacement: `[Image file too large: ${imagePath}]` };
      }

      const imageArrayBuffer = await this.app.vault.readBinary(imageFile);
      const base64 = arrayBufferToBase64(imageArrayBuffer);
      const mimeType = this.getMimeType(imagePath);

      return {
        original: `![[${imagePath}]]`,
        replacement: `<img src="data:${mimeType};base64,${base64}" alt="${imagePath}" style="max-width: 100%;">`
      };
    } catch (error) {
      return { original: `![[${imagePath}]]`, replacement: `[Image processing error: ${imagePath}]` };
    }
  }

  getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'image/png';
    }
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}