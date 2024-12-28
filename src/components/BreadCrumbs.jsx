"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname(); // Get the current path
  const pathArray = pathname.split("/").filter((path) => path);

  const capitalize = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <nav className="bg-gray-400 py-3">
      <div className="mx-auto md:mx-20 sm:mx-10">
        <ol className="list-reset flex text-gray-900  mx-auto md:mx-20 sm:mx-10">
          <li>
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          {pathArray.map((path, idx) => {
            const href = `/${pathArray.slice(0, idx + 1).join("/")}`;
            return (
              <li key={href} className="flex items-center">
                <span className="mx-2">/</span>
                <Link href={href} className="hover:text-gray-500">
                  {capitalize(path)}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
