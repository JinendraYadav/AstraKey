import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[var(--color-tertiary)] shadow-lg">
      <ul className="flex justify-between items-center px-6 py-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <li className="flex items-center font-extrabold text-2xl md:text-3xl tracking-wide">
          <img src="public\Logo.svg" alt="" className="w-12 h-12" />
          <div className="flex text-center">
            <span className="text-[var(--color-secondary)]">Astra </span>
            <span className="text-[var(--color-primary)]"> Key</span>
          </div>
        </li>

        {/* GitHub Button */}
        <li>
          <a
            href="https://github.com/JinendraYadav"
            target="_blank"
            className="flex items-center gap-2 bg-[var(--color-secondary)] text-white ring-2 ring-[var(--color-primary)] text-sm md:text-base font-medium px-4 py-2 rounded-full hover:bg-[#112D4E] transition"
          >
            <img src="public\github.svg" alt="GitHub" className="w-5 h-5" />
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
