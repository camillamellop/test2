import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context-prisma"
import { EventProvider } from "@/contexts/event-context-prisma"
import { FinanceProvider } from "@/contexts/finance-context-prisma"
import { ProjectProvider } from "@/contexts/project-context-prisma"
import { NoteProvider } from "@/contexts/note-context-prisma"
import { DocumentProvider } from "@/contexts/document-context-prisma"
import { InstagramProvider } from "@/contexts/instagram-context-prisma"
import { NotificationProvider } from "@/contexts/notification-context-prisma"
import { EventShareProvider } from "@/contexts/event-share-context-prisma"
import { BrandingProvider } from "@/contexts/branding-context-prisma"
import { ToastNotificationProvider } from "@/contexts/toast-notification-context"
import { SelfCareProvider } from "@/contexts/self-care-context-prisma"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Conexão UNK",
  description: "Plataforma de gerenciamento para DJs e produtores",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Conexão UNK",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Conexão UNK",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="application-name" content="Conexão UNK" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Conexão UNK" />
        <meta name="description" content="Plataforma de gerenciamento para DJs e produtores" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#3b82f6" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://unk-platform.vercel.app" />
        <meta name="twitter:title" content="Conexão UNK" />
        <meta name="twitter:description" content="Plataforma de gerenciamento para DJs e produtores" />
        <meta name="twitter:image" content="https://unk-platform.vercel.app/icon-192x192.png" />
        <meta name="twitter:creator" content="@unk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Conexão UNK" />
        <meta property="og:description" content="Plataforma de gerenciamento para DJs e produtores" />
        <meta property="og:site_name" content="Conexão UNK" />
        <meta property="og:url" content="https://unk-platform.vercel.app" />
        <meta property="og:image" content="https://unk-platform.vercel.app/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <EventProvider>
            <FinanceProvider>
              <ProjectProvider>
                <NoteProvider>
                  <SelfCareProvider>
                    <DocumentProvider>
                      <InstagramProvider>
                        <NotificationProvider>
                          <EventShareProvider>
                            <BrandingProvider>
                              <ToastNotificationProvider>
                                {children}
                              </ToastNotificationProvider>
                            </BrandingProvider>
                          </EventShareProvider>
                        </NotificationProvider>
                      </InstagramProvider>
                    </DocumentProvider>
                  </SelfCareProvider>
                </NoteProvider>
              </ProjectProvider>
            </FinanceProvider>
          </EventProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
