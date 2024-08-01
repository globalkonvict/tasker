/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/dashboard/tasks",
      },
    ];
  },
};

export default nextConfig;
