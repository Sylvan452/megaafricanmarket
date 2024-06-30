'use client';

import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useEffect, useState } from 'react';

export default function AutoCompleteInput({
  // type = "",
  // id = "",
  getItems = () => {},
  name = '',
  // resultStringKeyName="name",
  value = '',
  onChange = () => {},
  // className = "",
  ...otherProps
}: any) {
  const [items, setItems] = useState([]);
  const [showingResults, setShowingResults] = useState(false);
  const [val, setVal] = useState(value || '');
  const [timeSinceApiCall, setTimeSinceApiCall] = useState(new Date());

  useEffect(() => {
    (async () => {
      if (new Date().getTime() - timeSinceApiCall.getTime() < 2000) {
        return;
      }
      setTimeSinceApiCall(new Date());
      let newItems = [];
      try {
        newItems = await getItems();
      } catch {
        console.log('error occured while setting new items');
        newItems = [];
      }
      if (Array.isArray(newItems)) {
        setItems((oldItems) => {
          if (!newItems?.length) return oldItems;
          return newItems;
        });
      }
    })();
  }, [name, value]);

  return (
    <>
      <ReactSearchAutocomplete
        items={items || []}
        inputSearchString={value}
        onSearch={(string, results) => {
          onChange({
            target: {
              name,
              value: string || '',
            },
          });
        }}
        styling={{
          height: '34px',
          // border: "1px solid #dfe1e5",
          borderRadius: '2px',
          // backgroundColor: "transparent",
          boxShadow: 'rgba(32, 33, 36, 0) 0px 1px 6px 0px',
          zIndex: 1000, // Set a high z-index f
        }}
        onSelect={(item: any) => {
          onChange({
            target: {
              name,
              value:
                item?.[otherProps?.resultStringKeyName] || item?.name || '',
            },
          });
        }}
        showItemsOnFocus={false}
        showIcon={false}
        maxResults={5}
        {...otherProps}
        formatResult={(item) => {
          console.log('received item', item);
          return (
            <span
              className={'z-50'}
              style={{
                display: 'block',
                zIndex: '-20px',
                textAlign: 'left',
              }}
            >
              {item?.[otherProps?.resultStringKeyName] || item?.name}
            </span>
          );
          // return item?.[otherProps?.resultStringKeyName] || item?.name
        }}
        showNoResults={false}
        // className={"z-[-5px]"}
        // className={"bg-transparent"}
      />
      {showingResults && <div className={`h-[170px]`} />}
    </>
  );
}
