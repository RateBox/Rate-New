"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
require("@/styles/tailwind.css");
exports.metadata = {
    title: {
        template: '%s - Catalyst',
        default: 'Catalyst',
    },
    description: '',
};
async function RootLayout({ children }) {
    return (<html lang="en" className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950">
      <head>
        <link rel="preconnect" href="https://rsms.me/"/>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
      </head>
      <body>{children}</body>
    </html>);
}
exports.default = RootLayout;
