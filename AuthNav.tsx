"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AuthNav = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setType(localStorage.getItem("userType"));
  }, []);
  return userId ? (
    <>
      <Link
        href={type === "tour_guide" ? "/tour-guide-profile" : "/profile"}
        className="text-gray-800 hover:text-gray-600 font-medium"
      >
        PROFILE
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-gray-800 hover:text-gray-600 font-medium"
      >
        LOG IN
      </Link>
      <Link
        href="/register"
        className="border border-gray-700 rounded-md px-4 py-1 text-gray-800 hover:bg-gray-800 hover:text-white transition duration-300"
      >
        REGISTER
      </Link>
    </>
  );
};

export default AuthNav;
