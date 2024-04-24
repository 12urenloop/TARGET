const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = () => ({
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
        /*purgecss({
          content: ['dist/index.html', 'dist/assets/*.js'],
          css: ['dist/assets/*.css'],
          safelist: [
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^col-/,
            /^offset-/,
            /^btn-/,
            /^badge-/,
            /^border-/,
            /^bg-/,
            /^shadow-/,
            /^border/,
            /^text/,
            /^list-group-/,
            /^input-group-/,
            /^flag-/,
            /^fa-/,
            /^table-/,
            /^form-control-/,
            /^row-cols-/,
            /^container-/,
            /^fade-height/,
            /^alert-/,
            /^toast-/,
            /^chip-/,
            /^sidenav-/,
          ],
          output: 'dist/assets',
        }),*/
      ]
      : [],
});
