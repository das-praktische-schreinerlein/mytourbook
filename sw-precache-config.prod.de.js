module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/prod/frontend-de',
    stripPrefix: 'dist/prod/frontend-de',
    staticFileGlobs: [
        'dist/prod/frontend-de/index.html',
        'dist/prod/frontend-de/**.js',
        'dist/prod/frontend-de/**.css'
    ]
};