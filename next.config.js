/** @type {import('next').NextConfig} */
const { PHASE_PRODUCTION_BUILD, PHASE_EXPORT } = require('next/constants')

const isProd = process.env.NODE_ENV === 'production'
const isExport = process.env.NEXT_PUBLIC_BUILD_MODE === 'export'
const isStandalone = process.env.NEXT_PUBLIC_BUILD_MODE === 'standalone'

const mode = process.env.NEXT_PUBLIC_BUILD_MODE
const basePath = process.env.EXPORT_BASE_PATH || ''
const geminiApiKey = process.env.GEMINI_API_KEY || ''
const uploadProxyUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com'

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  const nextConfig = {
    reactStrictMode: false,
    output: isExport ? 'export' : isStandalone ? 'standalone' : undefined,
    trailingSlash: isExport,
    distDir: isExport ? 'out' : '.next',
    images: {
      unoptimized: isExport,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  }

  if (mode === 'export') {
    nextConfig.basePath = basePath
  }

  if (mode !== 'export') {
    nextConfig.rewrites = async () => {
      const apiKey = geminiApiKey.split(',')[0]
      const beforeFilesConfig = geminiApiKey
        ? [
            {
              source: '/api/google/upload/v1beta/files',
              has: [
                {
                  type: 'query',
                  key: 'key',
                  value: '(?<key>.*)',
                },
              ],
              destination: `${uploadProxyUrl}/upload/v1beta/files?key=${apiKey}`,
            },
            {
              source: '/api/google/v1beta/files/:id',
              has: [
                {
                  type: 'query',
                  key: 'key',
                  value: '(?<key>.*)',
                },
              ],
              destination: `${uploadProxyUrl}/v1beta/files/:id?key=${apiKey}`,
            },
          ]
        : [
            {
              source: '/api/google/upload/v1beta/files',
              has: [
                {
                  type: 'query',
                  key: 'key',
                  value: '(?<key>.*)',
                },
              ],
              destination: '/api/upload/files',
            },
            {
              source: '/api/google/v1beta/files/:id',
              has: [
                {
                  type: 'query',
                  key: 'key',
                  value: '(?<key>.*)',
                },
              ],
              destination: '/api/upload/files?id=:id',
            },
          ]
      return {
        beforeFiles: [
          {
            source: '/api/google/v1beta/models/:model',
            destination: '/api/chat?model=:model',
          },
          {
            source: '/api/google/upload/v1beta/files',
            has: [
              {
                type: 'query',
                key: 'uploadType',
                value: 'resumable',
              },
            ],
            missing: [
              {
                type: 'query',
                key: 'upload_id',
              },
            ],
            destination: `/api/upload`,
          },
          ...beforeFilesConfig,
        ],
      }
    }
  }

  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_EXPORT) {
    const withSerwist = (await import('@serwist/next')).default({
      // Note: This is only an example. If you use Pages Router,
      // use something else that works, such as "service-worker/index.ts".
      swSrc: 'app/sw.ts',
      swDest: 'public/sw.js',
      register: false,
    })
    return withSerwist(nextConfig)
  }

  // Optimization for production builds
  if (isProd) {
    nextConfig.compiler = {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    }
  }

  return nextConfig
}
