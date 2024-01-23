"use client"
import Navbar from '@/components/Navbar/Navbar';
import HomePage from '@/components/Home/Home';
import Download from '@/components/Download/Download';
import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();
  // console.log(pathname)

  return (
    <>
      <Navbar />
      {
        pathname === `/download/72474248` ? <Download /> : <HomePage />
      }
    </>
  );
}
