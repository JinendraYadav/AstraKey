import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-[var(--color-secondary)] text-[var(--color-tertiary)] py-6 mt-10 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg">🔐 Astra Key</p>
            <div className="tagline flex justify-center py-3 text-[var(--color-tertiary)]">
              <span>
                One
                <span className="text-[var(--color-primary)]"> Key</span>.
                Infinite
                <span className="text-[var(--color-primary)]"> Security</span>.
              </span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="opacity-70">
              &copy; {new Date().getFullYear()} Astra Key. All rights reserved.
            </p>
            <p className="mt-1 text-sm text-white">
              &lt; Developed by Jinendra Yadav 🧑‍💻 /&gt;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
