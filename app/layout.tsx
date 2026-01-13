import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestor de Gastos e Ingresos",
  description: "Aplicación para gestionar y controlar tus gastos e ingresos mensuales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
