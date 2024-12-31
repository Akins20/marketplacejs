/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import HomeImg from "@/assets/home-img.png";

export default function Banner() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-12 md:px-10 md:mx-10 mx-0">
      {/* First column: Text content */}
      <div className="flex-1 mb-6 md:mb-0">
        <div className="mx-16">
          <h1 className="text-xl font-light text-gray-800 mb-4">
            Hot Promotions
          </h1>
          <p className="text-4xl font-extrabold text-gray-800 mb-6">
            Fashion Trends, Accessories and Perfumes, 
            <span className="text-lime-400 font-thin">
              {Array.from("Foods and Snacks Delivery").map((char, index) => (
                <span
                  key={index}
                  className=""
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 1)", // Creates a dark drop shadow
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </p>
          <p className="text-lg text-gray-500 mb-6">
            Save more with Marketplace....
          </p>
          <Link
            href="/shop"
            className="inline-block bg-lime-700 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-green-600"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Second column: Image */}
      <div className="flex-1">
        <Image
          src={HomeImg} // Add your own image path here
          alt="Banner Image"
          width={700}
          height={700}
          className="object-cover"
        />
      </div>
    </div>
  );
}
