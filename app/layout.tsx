import './globals.css'
export const metadata = { title: 'Orkiosk', description: 'Tecnología, tutoriales y más' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
