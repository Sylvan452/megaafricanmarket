'use client';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export default function AutoCompleteInput() {
  return (
    <ReactSearchAutocomplete
      items={[
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
      ]}
    />
  );
}
