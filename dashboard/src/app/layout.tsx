import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar/Sidebar";
import AIAssistant from "../components/ai/AIAssistant";

export const metadata: Metadata = {
  title: "Service PC Master | Admin Dashboard",
  description: "Centro de Mando para Servicios Técnicos en Irapuato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
        <AIAssistant />
      </body>
    </html>
  );
}
