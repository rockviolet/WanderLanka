import Link from "next/link";
import AuthNav from "./AuthNav";

const MainNavbar = () => {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img
              className="text-2xl font-semibold text-gray-800"
              src="assets/logo 1.png"
            />
            <span className="ml-2">🚐</span>
          </div>
        </Link>
      </div>

      <nav className="flex items-center space-x-8">
        <Link
          href="/tour-guides"
          className="text-gray-800 hover:text-gray-600 font-medium"
        >
          TOUR GUIDES
        </Link>
        <AuthNav />
      </nav>
    </header>
  );
};

export default MainNavbar;
