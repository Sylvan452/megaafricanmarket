'use client';
import {ReactSearchAutocomplete} from 'react-search-autocomplete';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {Search} from 'lucide-react';
import {useEffect, useState} from "react";
import {trpc} from "@/trpc/client";
import axios from "axios";

// const SearchBar = () => {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();
//
//   const handleSearch = (searchTerm: string) => {
//     const params = new URLSearchParams(searchParams as any);
//     if (searchTerm) {
//       params.set('query', searchTerm);
//     } else {
//       params.delete('query');
//     }
//     router.replace(`${pathname}?${params.toString()}`);
//     router.refresh();
//   };
//
//   return (
//     <div className="flex">
//       <input
//         placeholder="Search for products"
//         defaultValue={searchParams.get('query') || ''}
//         onChange={(e) => handleSearch(e.target.value)}
//         className="block w-16/17 rounded-md border border-gray-100 text-sm outline-2 placeholder:text-gray-500"
//       />
//       <Search color="#2e763c" strokeWidth={1.25} />
//     </div>
//   );
// };

async function searchProducts(searchQuery = ""): Promise<Array<{ id: any; name: any; }>> {
  const products = (await axios.get(`/api/search-products?query=${searchQuery}`)).data
  console.log('products', products);

  return products || [
    {
      id: 0,
      name: 'Cobol',
    },
    {
      id: 1,
      name: 'JavaScript',
    },
    {
      id: 2,
      name: 'Basic',
    },
    {
      id: 3,
      name: 'PHP',
    },
    {
      id: 4,
      name: 'Java',
    },
  ]
}

export default function AutoCompleteSearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [items, setItems]: any = useState([])

  useEffect(() => {
    searchProducts().then(setItems)
  }, [])

  const handleSubmit = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams as any);
    if (searchTerm) {
      params.set('query', searchTerm);
    } else {
      params.delete('query');
    }
    router.push(`/?${params.toString()}`);
    console.log("navigated to ", `/?${params.toString()}`)
    router.refresh();
  };

  const handleSearch = () => {
    searchProducts(query).then(setItems)
  }

  return (
    <div className='min-w-[210px]'>
      <ReactSearchAutocomplete
        items={items}
        placeholder="Search for products"
        // inputSearchString={query}
        onSearch={(string, results) => {
          // onSearch will have as the first callback parameter
          // the string searched and for the second the results.
          handleSearch()
          console.log("searched", string, results)
          if (query === string) {
            console.log("navigating")
            handleSubmit(string)
          }
          setQuery(string)
        }}
        onSelect={(item: any) => {
          // the item selected
          console.log("selected", item, (item && item?.id))
          if (item && item?.id) router.push(`/product/${item?.id}`)
          router.replace(`/product/${item?.id}`)
        }}
        // onFocus={() => {
        //   console.log('Focused')
        // }}
        showNoResults={false}
        showItemsOnFocus={true}
      />
    </div>
  );
}
