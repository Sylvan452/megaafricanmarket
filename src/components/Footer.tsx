import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white flex-grow-0">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200">
          <div className="pb-8 pt-16">
            <div className="flex justify-center">
              <Link href="/">
                <Image src="/logo.png" alt="log" width={80} height={80} />
              </Link>
            </div>
          </div>
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-4 md:space-x-8 md:flex-col md:items-start">
            <span className="flex flex-col items-center gap-3">
              <a href="#" className="text-gray-600 hover:text-gray-800 ">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-700 uppercase mt-8 md:mt-0">
              Terms of Service
            </div>
            <div className="mt-2 md:mt-4">
              <ul>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/cookie-policy"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 uppercase mt-8 md:mt-0">
              Company
            </div>
            <ul className="mt-2 md:mt-4">
              <li>
                <a
                  href="/about-us"
                  className="text-gray-600 hover:text-gray-800"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  href="/testimonials"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
