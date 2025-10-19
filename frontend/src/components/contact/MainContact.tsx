// components/contact/MainContact.tsx (UPDATED)
import React from "react";
import Contact from "./contact";
import { Address } from "./Adress";

const MainContact = () => {
  return (
    <div className="mt-[10px] bg-black">
      {/* ADDRESS SECTION UPAR */}
      <Contact />
      <Address/>
      
      {/* CONTACT FORM NEECHE */}
    </div>
  );
};

export default MainContact;