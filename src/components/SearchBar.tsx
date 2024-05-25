'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Products } from '@/collections/Products/Products';

const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams as any);
    console.log(Products);
    if (searchTerm) {
      params.set('query', searchTerm);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex">
      <input
        placeholder="Search for products"
        defaultValue={searchParams.get('query') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-16/17 rounded-md border border-gray-100 text-sm outline-2 placeholder:text-gray-500"
      />
      <Search color="#2e763c" strokeWidth={1.25} />
    </div>
  );
};

export default SearchBar;
