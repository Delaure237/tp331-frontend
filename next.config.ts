import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.futura-sciences.com',
                pathname: '/**',
            },
        ],
    },

};

export default nextConfig;