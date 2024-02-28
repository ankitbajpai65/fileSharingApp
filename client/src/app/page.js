"use client"
import HomePage from '@/components/Home/Home';
import Download from '@/components/Download/Download';
import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();
  // console.log(pathname)

  return (
    <>
      {
        pathname === `/download` ? <Download /> : <HomePage />
      }
    </>
  );
}
