import "./globals.css";



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`antialiased`}
    >

        <h1>HEADER DA PÁGINA</h1>

      {children}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
