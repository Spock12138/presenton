
const nextConfig = {
  reactStrictMode: false,
  distDir: ".next-build",
  

  // // Rewrites for development - proxy font requests to FastAPI backend
  // async rewrites() {
  //   return [
  //     {
  //       source: '/app_data/fonts/:path*',
  //       destination: 'http://localhost:8000/app_data/fonts/:path*',
  //     },
  //   ];
  // },

  // Rewrites for development
  async rewrites() {
    // 优先读取环境变量，如果没有读到则默认使用 127.0.0.1:8000
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    return [
      // 1. 保留原有的字体转发规则 (不要删)
      {
        source: '/app_data/fonts/:path*',
        destination: `${apiUrl}/app_data/fonts/:path*`,
      },
      // 2. [新增] 关键！将 /api 开头的请求转发给后端
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // 3. [新增] 如果有 Swagger 文档或者 openapi.json 的需求，也可以加上
      {
        source: '/openapi.json',
        destination: `${apiUrl}/openapi.json`,
      },
      {
        source: '/docs',
        destination: `${apiUrl}/docs`,
      }
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7c765f3726084c52bcd5d180d51f1255.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "present-for-me.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "yefhrkuqbjcblofdcpnr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  
};

export default nextConfig;
