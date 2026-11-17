import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "CoDMux - Technology Education & Career Platform",
  description:
   "Learn coding, web development, data analytics and DSA with CoDMux. Practical project-based training, mentor guidance, and career preparation.",
  icons: {
    icon: "/assets/aistudio/codemuxlogo_913c6b11.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
