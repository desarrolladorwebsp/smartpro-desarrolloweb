import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

/// Las imágenes del portafolio y de los servicios las sirve SmartPro, no este
/// sitio. `next/image` solo optimiza dominios declarados aquí.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "smartpro.cl" },
  { protocol: "https", hostname: "www.smartpro.cl" },
];

if (isDevelopment) {
  /// Sin puerto fijo: SmartPro se levanta en el primer puerto libre.
  remotePatterns.push({ protocol: "http", hostname: "localhost" });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  images: {
    remotePatterns,
    /// Next bloquea por defecto optimizar imágenes de IPs locales. En desarrollo
    /// SmartPro corre en localhost, así que hay que permitirlo solo ahí.
    dangerouslyAllowLocalIP: isDevelopment,
  },
};

export default nextConfig;
