import type { NextConfig } from "next";
import os from "node:os";

/**
 * This machine's LAN addresses, so `npm run dev` also works when opened from
 * a phone or another device on the same Wi-Fi (http://192.168.x.x:3000).
 * Next 16 blocks dev resources from unlisted origins, which would leave the
 * page un-hydrated. Development only.
 */
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net): net is os.NetworkInterfaceInfo => !!net && net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
