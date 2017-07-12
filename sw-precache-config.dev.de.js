module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/dev/frontend-de',
    stripPrefix: 'dist/dev/frontend-de',
    staticFileGlobs: [
        'dist/dev/frontend-de/index.html',
        'dist/dev/frontend-de/**.js',
        'dist/dev/frontend-de/**.css'
    ]
};