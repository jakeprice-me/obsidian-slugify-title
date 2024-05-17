// main.js
const { Plugin } = require('obsidian');

module.exports = class SlugifyAliasPlugin extends Plugin {
    onload() {
        console.log('Slugify Alias Plugin: Loaded');

        this.addCommand({
            id: 'insert-slug-alias',
            name: 'Add Slugified Title into Aliases',
            callback: () => {
                console.log('Insert Slug Alias: Command executed');
                this.insertSlugAlias();
            },
        });
    }

insertSlugAlias() {
    console.log('Insert Slug Alias: Function called');

    const activeLeaf = this.app.workspace.activeLeaf;
    if (!activeLeaf) {
        console.log('Insert Slug Alias: No active leaf found');
        return;
    }

    const activeView = activeLeaf.view;
    if (!activeView) {
        console.log('Insert Slug Alias: No active view found');
        return;
    }

    const currentFile = activeView.file;
    if (!currentFile) {
        console.log('Insert Slug Alias: No current file found');
        return;
    }

    const cachedMetadata = this.app.metadataCache.getFileCache(currentFile);
    if (!cachedMetadata) {
        console.log('Insert Slug Alias: No cached metadata found');
        return;
    }

    const frontmatter = cachedMetadata.frontmatter || {};
    const title = frontmatter.title;
    if (!title) {
        console.log('Insert Slug Alias: No title found in frontmatter');
        return;
    }

    const slugifiedTitle = this.slugify(title);
    console.log(`Insert Slug Alias: Slugified title - ${slugifiedTitle}`);

    this.app.fileManager.processFrontMatter(currentFile, frontmatter => {
        // Ensure aliases exists and is an array, then push the slugified title
        if (!frontmatter.aliases) {
            frontmatter.aliases = [];
        }
        frontmatter.aliases.push(slugifiedTitle);
    })
    .then(() => {
        console.log('Insert Slug Alias: Alias inserted into aliases frontmatter');
    })
    .catch(error => {
        console.error('Insert Slug Alias: Error inserting alias into frontmatter', error);
    });
}

slugify(title) {
    const replacements = [
        ["&", "and"],
        ["%", "percent"],
        ['"', ""],
        ["'", ""],
        ["---", ""]
        // Add more replacements if needed
    ];

    let slug = title.toLowerCase();
    
    for (const replacement of replacements) {
        slug = slug.replace(new RegExp(replacement[0], 'g'), replacement[1]);
    }

    slug = slug.replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Replace consecutive hyphens resulting from space replacements with a single hyphen
    slug = slug.replace(/-+/g, '-');

    return slug;
}

};


