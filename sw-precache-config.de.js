module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/frontend-de',
    stripPrefix: 'dist/frontend-de',
    staticFileGlobs: [
        'dist/frontend-de/index.html',
        'dist/frontend-de/**.js',
        'dist/frontend-de/**.css'
    ]
};