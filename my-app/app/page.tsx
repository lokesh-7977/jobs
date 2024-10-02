import Footer from "@/components/custom/Footer";
import Hero from "@/components/custom/Hero";
import Jobs from "@/components/custom/job";
import Navbar from "@/components/custom/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Jobs/>
    <Footer/>
    </>
  );
}
