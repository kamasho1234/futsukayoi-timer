import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://futsukayoi-timer.net";
const SITE_NAME = "二日酔い回復タイマー";
const SITE_DESCRIPTION =
  "飲酒量からアルコール分解時間を自動計算。二日酔いの回復をリアルタイムでサポートする無料Webアプリ。お酒が抜ける時間の目安がすぐわかります。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "二日酔い回復タイマー - アルコール分解時間を自動計算",
    template: "%s | 二日酔い回復タイマー",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "二日酔い 回復",
    "アルコール 分解 時間",
    "二日酔い タイマー",
    "飲酒 計算",
    "お酒 抜ける 時間",
    "二日酔い 対策",
    "アルコール 計算機",
    "飲酒量 計算",
    "二日酔い 治し方",
    "アルコール 分解 計算",
    "飲み過ぎ 回復",
    "お酒 分解時間",
  ],
  authors: [{ name: "二日酔い回復タイマー" }],
  creator: "二日酔い回復タイマー",
  publisher: "二日酔い回復タイマー",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "二日酔い回復タイマー - アルコール分解時間を自動計算",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "二日酔い回復タイマー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "二日酔い回復タイマー - アルコール分解時間を自動計算",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "二日酔い回復タイマー",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    inLanguage: "ja",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "アルコールの分解時間はどのくらいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "体重60kgの男性の場合、ビール1杯（350ml・5%）のアルコール分解には約2〜3時間かかります。体重、性別、飲酒量によって個人差があります。一般的に、体重1kgあたり1時間に約0.1gのアルコールを分解できると言われています。",
        },
      },
      {
        "@type": "Question",
        name: "二日酔いを早く治す方法はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "水分補給が最も重要です。スポーツドリンクや経口補水液で電解質を補給しましょう。また、ビタミンB群やビタミンCの摂取、消化に良い食事（おかゆ、うどんなど）も効果的です。十分な睡眠と休息を取ることも大切です。",
        },
      },
      {
        "@type": "Question",
        name: "飲酒後、車を運転できるのはいつですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "アルコールが完全に分解されるまで運転は控えてください。分解時間は飲酒量や体質により異なります。当アプリでは飲酒量から分解時間の目安を計算できますが、あくまで参考値です。少しでも不安がある場合は運転を控えましょう。飲酒運転は法律で禁止されています。",
        },
      },
      {
        "@type": "Question",
        name: "このアプリの計算は正確ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Widmarkの公式に基づいた一般的な計算方法を使用していますが、アルコールの分解速度には個人差があります。体調、食事の有無、肝臓の状態などによっても変わるため、計算結果はあくまで目安としてご利用ください。",
        },
      },
      {
        "@type": "Question",
        name: "二日酔いに効く食べ物は何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "しじみの味噌汁（オルニチンが肝臓をサポート）、梅干し（クエン酸で代謝促進）、バナナ（カリウム補給）、はちみつ（果糖がアルコール分解を助ける）、大根おろし（消化酵素が豊富）などが効果的です。",
        },
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body>
        <div className="min-h-screen max-w-md mx-auto px-5 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
