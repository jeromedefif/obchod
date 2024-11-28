//** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Toto nastavení platí pro všechny cesty v aplikaci
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Toto nastavení povolí připojení k Supabase
            value: "default-src 'self'; connect-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ]
  }
};

module.exports = nextConfig;
