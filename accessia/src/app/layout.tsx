import "./globals.css";
import { Header } from '../components/header'



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`antialiased`}
    >
        <Header/>
       

      {children}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
