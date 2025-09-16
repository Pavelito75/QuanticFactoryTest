import "./globals.css";
import Nexa from 'next/font/local'
 
const myFont = Nexa({
  src: '../../public/nexa/Nexa-Trial-Regular.ttf',
})
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}