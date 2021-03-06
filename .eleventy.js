const markdownIt = require('markdown-it')
const pluginSrcsetImg = require('./.eleventy.srcset.js')

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')
const iconsprite = require('./utils/iconsprite.js')

module.exports = function (config) {

    config.addPlugin( pluginSrcsetImg, {
      autoselector: '.entry-content img',
      createCaptions: true
    });

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName])
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        config.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })

    // Icon Sprite
    config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

    // Asset Watch Targets
    config.addWatchTarget('./src/assets')

    // Markdown
    config.setLibrary(
        'md',
        markdownIt({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        })
    )

    config.addCollection('stories', collection => {
      return collection.getFilteredByGlob('./src/stories/*.md').sort(function(a, b) {
        return b.data.order - a.data.order;
      });
    });

    // Layouts
    // config.addLayoutAlias('base', 'base.njk')
    // config.addLayoutAlias('post', 'post.njk')
    // config.addLayoutAlias('default', 'layouts/default.njk');
    // config.addLayoutAlias('page', 'layouts/page.njk');
    // config.addLayoutAlias('cinema', 'layouts/cinema.njk');
    // config.addLayoutAlias('vue', 'layouts/vue.njk');

    // Pass-through files
    config.addPassthroughCopy({'src/_compiled' : 'assets'})
    config.addPassthroughCopy('src/uploads')
    config.addPassthroughCopy('src/admin')


    config.addPassthroughCopy('src/robots.txt')
    config.addPassthroughCopy('src/assets/images')
    config.addPassthroughCopy('src/assets/fonts')
    config.addPassthroughCopy({'src/data/site.json' : 'api/site.json'})
    // config.addPassthroughCopy({'src/data/categories.json' : 'api/categories.json'})
    config.addPassthroughCopy({ "./src/favicons/**/*": "./" });


    // Deep-Merge
    config.setDataDeepMerge(true)

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk','md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }
}
