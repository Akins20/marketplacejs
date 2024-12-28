import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
// import Newsletter from "./Newsletter";
import DoodiesiMg from "@/assets/doodies.jpeg";
import verveImg from "@/assets/Verve-Logo.png";
import mastercardImg from "@/assets/mastercard.png";
import visaImg from "@/assets/visa.png";

export default function Footer() {
  return (
    <footer className="bg-slate-400">
      {/* <Newsletter /> */}

      <div className="bg-slate-400 text-gray-800 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  mx-auto md:mx-20 sm:mx-10">
          {/* First Column - Contact Info */}
          <div>
            {/* <Image
              src={DoodiesiMg}
              alt="Logo"
              width={150}
              height={50}
              className="mb-4"
            /> */}
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <p className="mb-2 flex items-center">
              <FiPhone className="mr-2" /> +234 8113209561
            </p>
            {/* <p className="mb-2 flex items-center">
              <FiMail className="mr-2" /> info@doodie.com
            </p> */}
            {/* <p className="mb-2 flex items-center">
              <MdLocationOn className="mr-2" /> 12, micheal sosanya street,lagos
              Nigeria.
            </p> */}
            {/* <p className="flex items-center">
              <MdAccessTime className="mr-2" /> 9:00am - 10:00pm, Mon - Sat
            </p> */}
          </div>

          {/* Second Column - Information Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  prefetch={true}
                  className="hover:text-green-500"
                >
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/delivery-information"
                  prefetch={true}
                  className="hover:text-green-500"
                >
                  Delivery Information
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/privacy-policy"
                  prefetch={true}
                  className="hover:text-green-500"
                >
                  Privacy Policy
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/terms-conditions"
                  prefetch={true}
                  className="hover:text-green-500"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/" prefetch={true} className="hover:text-green-500">
                  Contact Us
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Third Column - Payment Methods and Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">We Accept</h3>
            <div className="flex space-x-4 mb-6">
              <Image
                src={mastercardImg}
                alt="Mastercard"
                width={50}
                height={30}
              />
              <Image src={visaImg} alt="Visa" width={50} height={30} />
              <Image src={verveImg} alt="Verve" width={80} height={30} />
            </div>

            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="/" prefetch={true} aria-label="Facebook">
                <FaFacebookF className="text-2xl hover:text-green-500" />
              </Link>
              <Link href="/" prefetch={true} aria-label="Twitter">
                <FaTwitter className="text-2xl hover:text-green-500" />
              </Link>
              <Link href="/" prefetch={true} aria-label="Instagram">
                <FaInstagram className="text-2xl hover:text-green-500" />
              </Link>
              <Link href="/" prefetch={true} aria-label="Pinterest">
                <FaPinterestP className="text-2xl hover:text-green-500" />
              </Link>
              <Link href="/" prefetch={true} aria-label="YouTube">
                <FaYoutube className="text-2xl hover:text-green-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 flex justify-around mx-auto md:mx-20 sm:mx-10">
          <p>
            &copy; {new Date().getFullYear()} Marketplace LTD. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 font-serif">
            ...Shop to your Satisfaction
          </p>
        </div>
      </div>
    </footer>
  );
}
