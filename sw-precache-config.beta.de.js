module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/beta/frontend-de',
    stripPrefix: 'dist/beta/frontend-de',
    staticFileGlobs: [
        'dist/beta/frontend-de/index.html',
        'dist/beta/frontend-de/**.js',
        'dist/beta/frontend-de/**.css'
    ]
};