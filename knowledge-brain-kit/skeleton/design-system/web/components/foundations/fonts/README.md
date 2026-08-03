# Custom Fonts Directory

Place your custom font files here to make them available in Storybook.

## Supported Formats
- `.ttf` (TrueType)
- `.otf` (OpenType)
- `.woff` (Web Open Font Format)
- `.woff2` (WOFF 2.0 - Recommended)

## Naming Convention
The font name in the Storybook toolbar will be derived from the filename **(excluding the extension)**.

**Examples:**
- `MyBrandFont.ttf` -> **MyBrandFont**
- `ComicSans-Bold.woff2` -> **ComicSans-Bold**

## Usage
1. Drop the file here.
2. Restart Storybook (or wait for HMR).
3. Select the font from the "Font" dropdown in the toolbar.
