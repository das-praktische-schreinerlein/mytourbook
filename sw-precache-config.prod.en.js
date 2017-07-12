module.exports = {
    maximumFileSizeToCacheInBytes: 6000000,
    navigateFallback: '/index.html',
    root: 'dist/prod/frontend-en',
    stripPrefix: 'dist/prod/frontend-en',
    staticFileGlobs: [
        'dist/prod/frontend-en/index.html',
        'dist/prod/frontend-en/**.js',
        'dist/prod/frontend-en/**.css'
    ]
};