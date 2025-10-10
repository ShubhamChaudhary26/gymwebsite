import React from "react";
import AboutSection from "./AboutHero";
import ProgramsSection from "./program";
import GallerySection from "./GallerySection";
import { GlowingEffectDemo } from "./ParaGraph";
import InfiniteMenu from "./infiniteScroll";

const items = [
  {
    image: "/gym2.webp",
    link: "https://google.com/",
    title: "Item 1",
    description: "This is pretty cool, right?",
  },
  {
    image: "/gym2.webp",
    link: "https://google.com/",
    title: "Item 2",
    description: "This is pretty cool, right?",
  },
  {
    image: "/gym2.webp",
    link: "https://google.com/",
    title: "Item 3",
    description: "This is pretty cool, right?",
  },
  {
    image: "/gym2.webp",
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },
];
const about = () => {
  return (
    <>
      <ProgramsSection />
      <div className="relative h-[600px] md:h-[900px]">
        <InfiniteMenu items={items} />
      </div>
      {/* <GlowingEffectDemo /> */}
      <AboutSection />
      <GallerySection />
    </>
  );
};

export default about;
