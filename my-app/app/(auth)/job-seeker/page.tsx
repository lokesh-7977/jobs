/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser } from "react-icons/ai";
import { BiLock } from "react-icons/bi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import Image from "next/image"; // Ensure you import Image from Next.js
import QR from "./../../../dummy_qr_code.png";

// Define validation schema
const signupSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    passwordConfirmation: z
      .string()
      .min(6, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Jobseeker = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false); // To track password confirmation state
  const [utrNumber, setUtrNumber] = useState(""); // Track UTR number input
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    const { passwordConfirmation, ...signupData } = data;
    const signupPayload = {
      ...signupData,
      role: "jobSeeker",
    };

    try {
      const response = await axios.post("/api/auth/register", signupPayload);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to create account");
      } else {
        toast.error("Failed to create account");
      }
    }
  };

  const handlePasswordConfirmationBlur = () => {
    // Check if passwords match
    if (errors.passwordConfirmation?.message === undefined) {
      setIsPasswordConfirmed(true); // Allow UTR input and QR code to display
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <div className="bg-[#FAFAFA] px-10 py-16">
        <div className="bg-white w-full max-w-[600px] border border-gray-300 m-auto px-8 py-12">
          <h1 className="text-xl text-center mb-7 text-gray-600">Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-7">
              <Label htmlFor="name" className="flex items-center gap-3">
                <AiOutlineUser className="text-lg text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Name"
                  className={`outline-0 w-full text-sm h-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </Label>
              {errors.name && <p className="text-red-500 text-center text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-7">
              <Label htmlFor="email" className="flex items-center gap-3">
                <AiOutlineUser className="text-lg justify-center text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Email address"
                  className={`outline-0 w-full text-sm h-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </Label>
              {errors.email && <p className="text-red-500 text-center text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-7">
              <Label htmlFor="password" className="flex items-center gap-3">
                <BiLock className="text-lg text-gray-500" />
                <div className="flex flex-row border-gray-200 rounded-lg border-2 w-full gap-6 justify-center items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Password"
                    className={`outline-0 border-none w-full text-sm h-10 pr-3 ${errors.password ? "border-red-500 justify-center" : ""}`}
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible onClick={() => setShowPassword(false)} className="cursor-pointer text-gray-500 mr-3 text-lg" />
                  ) : (
                    <AiFillEye onClick={() => setShowPassword(true)} className="cursor-pointer text-gray-500 mr-3 text-lg" />
                  )}
                </div>
              </Label>
              {errors.password && <p className="text-red-500 text-center text-sm">{errors.password.message}</p>}
            </div>

            <div className="mb-7">
              <Label htmlFor="passwordConfirmation" className="flex items-center gap-3">
                <BiLock className="text-lg text-gray-500" />
                <div className="flex flex-row border-gray-200 rounded-lg border-2 w-full gap-6 justify-center items-center">
                  <Input
                    id="passwordConfirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    {...register("passwordConfirmation")}
                    onBlur={handlePasswordConfirmationBlur} // Trigger password confirmation check
                    placeholder="Password confirmation"
                    className={`outline-0 w-full border-none bg-none text-sm h-10 pr-3 ${errors.passwordConfirmation ? "border-red-500 " : ""}`}
                  />
                  {showPasswordConfirmation ? (
                    <AiFillEyeInvisible onClick={() => setShowPasswordConfirmation(false)} className="cursor-pointer text-gray-500 mr-3 text-lg" />
                  ) : (
                    <AiFillEye onClick={() => setShowPasswordConfirmation(true)} className="cursor-pointer text-gray-500 mr-3 text-lg" />
                  )}
                </div>
              </Label>
              {errors.passwordConfirmation && <p className="text-red-500 text-center text-sm">{errors.passwordConfirmation.message}</p>}
            </div>

            {/* Show QR code and UTR input only after password confirmation */}
            {isPasswordConfirmed && (
              <>
                <div className="flex justify-center mb-7">
                  <Image
                    src={QR}
                    alt="QR Code for Payment"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="mb-7">
                  <Label htmlFor="utrNumber" className="flex items-center gap-3">
                    <BiLock className="text-lg text-gray-500" />
                    <Input
                      id="utrNumber"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      type="text"
                      placeholder="UTR Number"
                      className={`outline-0 w-full text-sm h-10 `}
                    />
                  </Label>
                 
                    
                </div>

                <div className="text-center text-lg text-gray-600 mt-3">
                  Payment: ₹499
                </div>
              </>
            )}

            <Button type="submit" className="bg-[#504ED7] hover:bg-[#2825C2] cursor-pointer transition-[background] text-sm w-full py-3 text-white rounded-sm mt-7">
              Sign Up
            </Button>
          </form>
          <p className="mt-8 text-gray-400 text-sm text-center">
            Already have an account?
            <Link className="outline-0 text-blue-500" href={"/login"}>
              {" "}Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobseeker
