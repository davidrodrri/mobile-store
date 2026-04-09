import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    compiler: {
        styledComponents: {
            ssr: true, // Enable server-side rendering for styled-components
            displayName: true, // Enable display names for styled-components
        },
    },
};

export default nextConfig;
