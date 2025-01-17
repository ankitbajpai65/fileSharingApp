"use client";
import { useContext } from "react";
import HomePage from "@/components/Home/Home";
import Download from "@/components/Download/Download";
import { usePathname } from "next/navigation";
import { AppContext } from "@/app/context/AppContext";
import NoLoginPage from "@/components/Home/NoLoginPage";
import Loader from "@/components/Home/Loader";

export default function Home() {
  const pathname = usePathname();
  const { isUserLoggedin, userData, isLoading } = useContext(AppContext);

  return (
    <>
      {pathname === `/download` ? (
        <Download />
      ) : /* isLoading ? <Loader isLoading={isLoading} /> : */
      isUserLoggedin ? (
        <HomePage />
      ) : (
        <NoLoginPage />
      )}
    </>
  );
}
