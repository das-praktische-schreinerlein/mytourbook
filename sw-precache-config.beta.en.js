module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/beta/frontend-en',
    stripPrefix: 'dist/beta/frontend-en',
    staticFileGlobs: [
        'dist/beta/frontend-en/index.html',
        'dist/beta/frontend-en/**.js',
        'dist/beta/frontend-en/**.css'
    ]
};