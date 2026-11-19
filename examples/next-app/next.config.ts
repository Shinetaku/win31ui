import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@win31ui/react', '@win31ui/tokens'],
  reactStrictMode: true
}

export default config
