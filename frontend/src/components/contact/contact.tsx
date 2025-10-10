"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Globe } from "./map"; // <-- Globe import add karna

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <>
      <div className="text-center text-5xl bg-black text-default">
        Contact Us
        <p className="text-lg text-gray-400 max-w-2xl mx-auto py-5">
          Got questions or need support? We're here to help! Reach out to us
          through any of the channels below and our team will respond as soon as
          possible.
        </p>
      </div>
      <div className="flex min-h-screen gap-[100px] items-center justify-center bg-black dark:bg-zinc-950 ">
        {/* Left Form */}
        <div className="shadow-input h-[80vh]  my-12 w-full max-w-lg rounded-2xl bg-white px-8 py-10 dark:bg-black">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to <span className="text-default">Veltrix</span>
          </h2>

          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            Have questions or need help? <br />
            Let&apos;s connect through our Contact Us form.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:flex-row ">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Durden" type="text" />
              </LabelInputContainer>
            </div>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                placeholder="Type your message here..."
                type="text"
              />
            </LabelInputContainer>

            <button
              className="group/btn relative mt-4 block h-11 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md dark:from-zinc-900 dark:to-zinc-900"
              type="submit"
            >
              Let&apos;s Connect &rarr;
            </button>
          </form>
        </div>

        {/* Right Globe */}
        <div className="hidden w-1/1 justify-center md:flex">
          <Globe />
        </div>
      </div>
      
      
    </>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-1", className)}>
      {children}
    </div>
  );
};
