/** @type {import('next').NextConfig} */
export default{
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.next.json",
  }
};
