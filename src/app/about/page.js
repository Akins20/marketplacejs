import React from "react";
import Image from "next/image";
import doodiesImg from "@/assets/doodies.jpeg";

const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* About Section */}
      <div className="text-center py-16 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <h3 className="text-lg text-gray-600 mt-4">...Know More About Us...</h3>
      </div>

      {/* Home Welcome Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center py-16 bg-white px-6 lg:px-32">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          {/* <Image
            src={doodiesImg}
            alt="Doodies logo"
            width={400}
            height={400}
            className="rounded-md shadow-lg"
          /> */}
        </div>
        <div className="w-full lg:w-1/2 lg:pl-12 text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            About Our Website
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Welcome to our website, your one-stop destination for a diverse
            range of products designed to elevate your lifestyle! We pride
            ourselves on offering a curated selection of stylish clothing,
            delectable foods, enchanting perfumes, and unique accessories that
            cater to all your needs.
          </p>
          {/* <span className="text-blue-600 font-semibold">
            Welcome to Doodies, where we turn your shopping needs into
            delightful moments!
          </span> */}
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-6">
        <i className="fas fa-shopping-bag text-3xl text-blue-600"></i>
      </div>

      {/* Delivery Information Section */}
      <section className="py-16 px-6 lg:px-32 bg-gray-100">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Delivery Information
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          We strive to make your shopping experience as smooth and
          enjoyable as possible, and that includes our delivery service. We
          offer a variety of delivery methods to meet your needs, including
          standard and express options. Choose the one that works best for you
          at checkout!
        </p>
      </section>
    </div>
  );
};

export default About;
