import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavItems from './NavItems';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { getServerSideUser } from '@/lib/payload.utils';
import UserAccountNav from './UserAccountNav';
import Cart from './Cart';
import Wishlist from './Wishlist';
import AutoCompleteSearchInput from './AutoCompleteSearchInput';

const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });

interface SearchParams {
  query?: string;
}

const Navbar = async ({ searchParams }: { searchParams?: SearchParams }) => {
  const query = searchParams?.query || '';
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="bg-white sticky z-50 top-0 justify-between inset-x-0 h-auto">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex flex-col lg:flex-row h-auto lg:h-16 items-center">
              <div className="flex items-center w-full lg:w-auto">
                <MobileNav user={user} />
                <div className="ml-4 flex lg:ml-0">
                  <Link href="/">
                    <Image src="/logo.png" alt="hero" width={80} height={80} />
                  </Link>
                </div>
                <div className="ml-auto flex space-x-2 lg:hidden">
                  <Cart />
                  <Wishlist />
                </div>
              </div>

              <div className="hidden lg:flex lg:ml-8 lg:self-stretch lg:flex-1">
                <NavItems />
                <div className="flex flex-1 mx-4 lg:w-3/5">
                  {' '}
                  {/* Adjusted width for AutoCompleteSearchInput */}
                  <AutoCompleteSearchInput />
                </div>
              </div>

              <div className="ml-auto items-center hidden lg:flex lg:space-x-2 lg:items-center lg:justify-end">
                {!user ? (
                  <>
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: 'ghost' })}
                    >
                      Sign in
                    </Link>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: 'ghost' })}
                    >
                      Create Account
                    </Link>
                    <Cart />
                    <Wishlist />
                  </>
                ) : (
                  <UserAccountNav user={user} />
                )}
              </div>

              {user && (
                <div className="hidden lg:flex lg:space-x-2 lg:items-center lg:justify-end">
                  <Cart />
                  <Wishlist />
                </div>
              )}
            </div>
            <div className="w-full px-4 py-2 lg:hidden">
              <AutoCompleteSearchInput />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
