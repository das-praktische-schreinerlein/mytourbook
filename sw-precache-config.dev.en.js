module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/dev/frontend-en',
    stripPrefix: 'dist/dev/frontend-en',
    staticFileGlobs: [
        'dist/dev/frontend-en/index.html',
        'dist/dev/frontend-en/**.js',
        'dist/dev/frontend-en/**.css'
    ]
};