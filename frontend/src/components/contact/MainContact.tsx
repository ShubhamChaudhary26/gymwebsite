import React from "react";
import Contact from "./contact";
import { Address } from "./Adress";

const MainContact = () => {
  return (
    <div className="mt-[120px] bg-black">
      <Contact />
      <Address/>
    </div>
  );
};

export default MainContact;
