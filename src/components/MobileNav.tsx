'use client';

import { PRODUCT_CATEGORIES } from '@/config';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserAccountNav from './UserAccountNav';
import { User } from '@/payload-types';

interface MobileNavProps {
  user: User | null;
}

const MobileNav = ({ user }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  // Close the menu when navigating away
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Remove second scrollbar when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen)
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
    );

  return (
    <div>
      <div className="relative z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </div>

      <div className="fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex">
        <div className="w-4/5">
          <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2">
              <div>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/"
                  className="block px-4 py-2 font-medium text-gray-900"
                >
                  Home
                </Link>
              </div>
              {!user && (
                <div className="space-y-4 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/sign-in"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/sign-up"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}

              {user && (
                <div className="ml-4">
                  <UserAccountNav user={user} />
                </div>
              )}

              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li key={category.label} className="space-y-1 px-4 pb-4 pt-6">
                    <div className="border-b border-gray-200">
                      <div className="-mb-px flex">
                        <p className="border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium">
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="group-hover:opacity-75"></div>
                          <Link
                            href={item.href}
                            className="mt-4 block font-medium text-gray-900"
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
