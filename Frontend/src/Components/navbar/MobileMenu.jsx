import React from "react";
import NavLinks from "./NavLinks";
import AuthMenu from "./AuthMenu";

const MobileMenu = ({ user, closeMenu }) => {
  return (
    <div className="fixed top-[64px] left-0 w-full bg-white shadow-md flex flex-col gap-4 p-4 md:hidden z-50 animate-slideDown">
      <NavLinks onClick={closeMenu} />
      <AuthMenu user={user} mobile={true} closeMenu={closeMenu} />
    </div>
  );
};

export default MobileMenu;
