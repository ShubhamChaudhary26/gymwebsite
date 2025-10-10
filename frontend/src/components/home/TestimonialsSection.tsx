"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity...",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
    rating: 5,
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles...",
    name: "William Shakespeare",
    title: "Hamlet",
    rating: 4,
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. Yet little is said of the fortune itself, or the desires of the man...",
    name: "Jane Austen",
    title: "Pride and Prejudice",
    rating: 5,
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little...",
    name: "Herman Melville",
    title: "Moby-Dick",
    rating: 4,
  },
  {
    quote:
      "In the middle of every difficulty lies opportunity. What appears as a stumbling block may very well be the stepping stone that leads you forward in ways you cannot yet imagine.",
    name: "Albert Einstein",
    title: "Philosopher of Science",
    rating: 5,
  },
  {
    quote:
      "The only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance.",
    name: "Franklin D. Roosevelt",
    title: "Inaugural Address, 1933",
    rating: 4,
  },
];



export function InfiniteMovingCardsDemo() {
  return (
    <div className=" flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="textHeadingmobile md:textHeadinglaptop">
          What Our <span className="text-default">Clients Say</span>
        </h2>
        <p className="textafterHeading max-w-2xl mx-auto ">
          Real reviews from our valued members sharing their fitness journey and results.
        </p>
      </div>

      {/* Infinite Moving Cards */}
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
        className="px-4"
      />
    </div>
  );
}
