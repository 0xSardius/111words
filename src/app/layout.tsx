import type { Metadata } from "next";

import { getSession } from "~/auth"
import "~/app/globals.css";
import { Providers } from "~/app/providers";


export const metadata: Metadata = {
  title: "111words",
  description: "Write daily and mint your words as ERC-20 coins on Base. Build streaks, earn rewards, and share your creativity with the world.",
  other: {
    "fc:frame": "vNext",
    "fc:frame:name": "111words",
    "fc:frame:icon": "https://111words.vercel.app/icon.png",
    "fc:frame:home_url": "https://111words.vercel.app",
    "fc:frame:image": "https://111words.vercel.app/icon.png",
    "fc:frame:button:1": "Start Writing",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://111words.vercel.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const session = await getSession()

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
