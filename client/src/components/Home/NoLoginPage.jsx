"use client";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authImg from "../../../public/authImg3.png";
import "./Home.css";

const NoLoginPage = () => {
  const router = useRouter();

  return (
    <section className="homeSection homeDefaultContainer">
      <div className="overlay"></div>
      <div className="authImgContainer">
        <Image
          src={authImg}
          alt="image"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="notLoggedinContainer">
        <Typography variant="h4" className="homeDefaultText">
          Welcome to the Filegem!
        </Typography>
        <Typography variant="h6" className="homeDefaultText">
          You need to be logged in to share files.
        </Typography>
        <Button variant="contained" onClick={() => router.push("/login")}>
          Login
        </Button>
      </div>
    </section>
  );
};

export default NoLoginPage;
