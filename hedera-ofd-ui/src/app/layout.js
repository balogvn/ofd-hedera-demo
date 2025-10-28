// hedera-ofd-ui/src/app/layout.js

export const metadata = {
    title: "Oracle Free Dollar (OFD)",
    description: "Hedera OFD Mint & Send Interface",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
          <header style={{ marginBottom: "2rem" }}>
            <h1>💸 Oracle Free Dollar (OFD)</h1>
          </header>
          {children}
        </body>
      </html>
    );
  }
  