
import React from "react";
import viteLogo from '../assets/react.svg';

const Navbar = () => {

    return(
        <nav className="bg-blue-600 text-white p-4 flex items-center justify-between ">
      <h1 className="momo-font text-xl font-bold curser-pointer">My App</h1>

      <ul className="flex gap-6">
        <li className="momo-font hover:text-yellow-300 cursor-pointer font-bold">Home</li>
        <li className="momo-font hover:text-yellow-300 cursor-pointer font-bold">About</li>
        <li className="momo-font hover:text-yellow-300 cursor-pointer font-bold">Contact</li>
      </ul>
    </nav>
    );
};
export default Navbar;
