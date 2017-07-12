module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/frontend-en',
    stripPrefix: 'dist/frontend-en',
    staticFileGlobs: [
        'dist/frontend-en/index.html',
        'dist/frontend-en/**.js',
        'dist/frontend-en/**.css'
    ]
};