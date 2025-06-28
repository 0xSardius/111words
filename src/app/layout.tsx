import type { Metadata } from "next";

import { getSession } from "~/auth"
import "~/app/globals.css";
import { Providers } from "~/app/providers";


export const metadata: Metadata = {
  title: "111words",
  description: "Write daily and mint your words as ERC-20 coins on Base. Build streaks, earn rewards, and share your creativity with the world.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "fc:frame": JSON.stringify({
      "version": "next",
      "imageUrl": "https://111words.vercel.app/logo.png",
      "button": {
        "title": "Start Writing",
        "action": {
          "type": "launch_frame",
          "name": "111words",
          "url": "https://111words.vercel.app",
          "splashImageUrl": "https://111words.vercel.app/splash.png"
        }
      }
    }),
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
