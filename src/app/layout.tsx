import type { Metadata } from "next";
import Link from "next/link";
import { displayName } from "@/lib/content";
import "./globals.css";
export const metadata: Metadata = {
 title: { default: "Three Worlds | Concept", template: "%s | Three Worlds" },
 description: "Unpublished portfolio prototype. Client content must be verified before launch.",
 robots: { index: false, follow: false },
};
const destinations = [
 {href:"/",label:"All Worlds",number:"00"},
 {href:"/engineering",label:"Engineering",number:"01"},
 {href:"/graphics",label:"Graphics",number:"02"},
 {href:"/visibility",label:"Visibility",number:"03"},
 {href:"/about",label:"About",number:""},
 {href:"/contact",label:"Contact",number:""},
];
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body><a className="skip" href="#content">Skip to content</a>
 <header className="site-header"><Link className="identity" href="/" aria-label="All Worlds, home">{displayName}<span className="identity-mark" aria-hidden="true">↗</span></Link>
 <nav aria-label="Primary navigation" className="desktop-nav">{destinations.map(d=><Link key={d.href} href={d.href}><span className="nav-index">{d.number}</span>{d.label}</Link>)}</nav>
 <details className="mobile-navigation"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation">{destinations.map(d=><Link key={d.href} href={d.href}><span>{d.number}</span>{d.label}</Link>)}</nav></details>
 </header><main id="content">{children}</main><footer className="footer"><span>{displayName}</span><span>Portfolio prototype · Content not approved for publication</span><a href="#content">Back to top ↑</a></footer></body></html>;
}
