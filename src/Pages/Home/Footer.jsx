import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* About Section */}
        <div>
          <h3 className="text-white font-semibold mb-2">About CivicConnect</h3>
          <p className="text-gray-400">
            CivicConnect empowers citizens to report and resolve social issues
            through community-driven action.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="text-gray-400 space-y-1">
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/report" className="hover:text-white">
                Report Issue
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-2">Connect</h3>
          <p className="text-gray-400">Email: support@civicconnect.org</p>
          <p className="text-gray-400">Phone: +880-1234-567890</p>
          <div className="mt-2 flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              FB
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              TW
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              IG
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} CivicConnect — All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
