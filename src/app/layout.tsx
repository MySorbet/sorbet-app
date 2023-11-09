// import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/colors.css';
import '@/styles/globals.css';

import Head from './head';

// import { siteConfig } from '@/constant/config';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.title,
//     template: `%s | ${siteConfig.title}`,
//   },
//   description: siteConfig.description,
//   robots: { index: true, follow: true },
//   // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
//   // ! copy to /favicon folder
//   icons: {
//     icon: '/favicon/favicon.ico',
//     shortcut: '/favicon/favicon-16x16.png',
//     apple: '/favicon/apple-touch-icon.png',
//   },
//   manifest: `/favicon/site.webmanifest`,
//   openGraph: {
//     url: siteConfig.url,
//     title: siteConfig.title,
//     description: siteConfig.description,
//     siteName: siteConfig.title,
//     images: [`${siteConfig.url}/images/og.jpg`],
//     type: 'website',
//     locale: 'en_US',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: siteConfig.title,
//     description: siteConfig.description,
//     images: [`${siteConfig.url}/images/og.jpg`],
//     // creator: '@th_clarence',
//   },
//   // authors: [
//   //   {
//   //     name: 'Theodorus Clarence',
//   //     url: 'https://theodorusclarence.com',
//   //   },
//   // ],
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body>{children}</body>
    </html>
  );
}

// "use client";

// import Script from "next/script";
// // import { WalletSelectorContextProvider } from "@/components/common/near-wallet/wallet-selector-context";
// import "./global.css";
// // import "@near-wallet-selector/modal-ui/styles.css";
// // import Verify from "./verify";
// // import Head from "./head";

// import { RecoilRoot } from "recoil";
// // import Dashboard from "@/components/dashboard";
// import { usePathname } from "next/navigation";
// // import Sidebar from "@/components/sidebar";
// import { useEffect, useState } from "react";
// // import { ContractProvider } from "@/context/contract";
// // import Modals from "@/components/home/modal";

// interface Props {
//   children: React.ReactNode;
// }

// // window.Buffer = window.Buffer || require("buffer").Buffer;

// const RootLayout: React.FC<Props> = ({ children }) => {
//   const path = usePathname();
//   // let bHideDashboard = path == "/" || path?.includes("/signin") || path?.includes("oauth-callback");

//   const [padding, setPadding] = useState(264);
//   useEffect(() => {
//     function getSnapshot() {
//       // setPadding(bHideDashboard ? 0 : window.innerWidth > 1024 ? 264 : 0);
//     }
//     getSnapshot();
//     window.addEventListener("resize", getSnapshot);
//     return () => window.removeEventListener("resize", getSnapshot);
//   });

//   return (
//     <html id="HTML" lang="en">
//       {/* <Head /> */}
//       <body id="Body">
//         <RecoilRoot>
//           {/* <WalletSelectorContextProvider> */}
//             {/* <ContractProvider> */}
//                 <div className="flex w-full" >
//                   {/* {!bHideDashboard && <Sidebar />} */}
//                   <div
//                     className={`w-full`}
//                     // style={{ paddingLeft: `${padding}px` }}
//                   >
//                     {children}
//                   </div>
//                 </div>
//                 {/* <Modals /> */}
//             {/* </ContractProvider> */}
//           {/* </WalletSelectorContextProvider> */}
//         </RecoilRoot>
//       </body>
//     </html>
//   );
// };
// export default RootLayout;
