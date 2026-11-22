# Simple Manga Reader

A free, static manga reader for **GitHub Pages**. No database, installation, framework, or build step required.

## Features
- Single-page manga reading with page buttons, keyboard arrows, and click-to-turn
- Japanese (right-to-left) and Western (left-to-right) reading direction
- Vertical scrolling / long-strip mode
- Chapter picker and chapter list
- Light and dark themes
- Automatically saves the last chapter and page in your browser
- Mobile-friendly design

## Add your own manga

1. Put your manga images inside `chapters/chapter-1/`, such as `001.jpg`, `002.jpg`, `003.jpg`.
2. Edit `manga.js`. Change `title` and `description`, and update the `pages` list to match your filenames:

```js
window.MANGA = {
  title: "My Manga",
  description: "An English translation.",
  chapters: [
    {
      id: "chapter-1",
      title: "Chapter 1",
      pages: [
        "chapters/chapter-1/001.jpg",
        "chapters/chapter-1/002.jpg"
      ]
    },
    {
      id: "chapter-2",
      title: "Chapter 2",
      pages: [
        "chapters/chapter-2/001.png",
        "chapters/chapter-2/002.png"
      ]
    }
  ]
};
```

3. Add as many chapters as you want. Supported browser formats include JPEG, PNG, WebP, GIF, and SVG. **Only upload material you have the rights to publish.**
4. The bundled three `.svg` images are placeholder pages. Replace them with your own images and update `manga.js`.

**Important:** Filenames and folder names are case-sensitive on GitHub Pages, and the paths in `manga.js` must match exactly.

## Publish on GitHub Pages

1. Create a new **public** repository on GitHub, e.g. `manga-reader`.
2. Upload the contents of this folder to the repository root. Make sure `index.html` is at the root, **not nested under a second `manga-reader` folder**.
3. Commit your files.
4. Open your repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
6. Once GitHub finishes deployment, your site will be at `https://YOUR-USERNAME.github.io/manga-reader/` (replace `YOUR-USERNAME` with your username and `manga-reader` with your repository name).

If the site gives a 404 at first, check the Pages deployment status in **Actions** and confirm your `index.html` is in the repository root.

## Run locally

Simply open `index.html` in your browser. Or use VS Code's Live Server extension. No `npm install` required.

## Customize

Edit `style.css` for colors and layout. Edit `manga.js` for the manga title and chapters. The website has no external dependencies.
