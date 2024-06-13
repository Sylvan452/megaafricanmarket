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
import { Construction } from 'lucide-react';
import AutoCompleteInput from './AutoCompleteInput';

const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });

interface SearchParams {
  query?: string;
}

const Navbar = async ({ searchParams }: { searchParams?: SearchParams }) => {
  const query = searchParams?.query || '';
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  // console.log('user', user);

  return (
    <div className="bg-white sticky z-50 top-0 justify-between inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <MobileNav user={user} />
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image src="/logo.png" alt="hero" width={80} height={80} />
                </Link>
              </div>

              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="hidden lg:flex flex-1 mx-4">
                <SearchBar />
              </div>
              <AutoCompleteInput />

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 space-x-4 lg:items-center lg:justify-end lg:space-x-6">
                  {!user ? (
                    <>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({ variant: 'ghost' })}
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        href="/sign-up"
                        className={buttonVariants({ variant: 'ghost' })}
                      >
                        Create Account
                      </Link>
                      <Cart />
                    </>
                  ) : (
                    <>
                      <UserAccountNav user={user} />
                      <Cart />
                      <Wishlist />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
