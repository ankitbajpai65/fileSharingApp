import './globals.css'
import { Inter } from 'next/font/google';
import ThemeContext from './context/ThemeProvider';
import AppContextProvider from './context/AppContext';
import Navbar from '@/components/Navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Filegem',
  description: 'An easy file sharing application.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeContext>
          <AppContextProvider>
            <Navbar />
            {children}
          </AppContextProvider>
        </ThemeContext>
      </body>
    </html>
  )
}
