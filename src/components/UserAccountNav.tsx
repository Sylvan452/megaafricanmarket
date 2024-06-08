'use client';

import { User } from '@/payload-types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import MyOrders from './MyOrders';

interface UserAccountNavProps {
  user: User | null;
}

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openOrdersSheet = () => setIsSheetOpen(true);
  const closeOrdersSheet = () => setIsSheetOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="overflow-visible">
          <Button variant="ghost" size="sm" className="relative">
            My account
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white w-60" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              <p className="font-medium text-sm text-black">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={openOrdersSheet}
            className="cursor-pointer"
          >
            My Orders
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MyOrders user={user} isOpen={isSheetOpen} onClose={closeOrdersSheet} />
    </>
  );
};

export default UserAccountNav;
