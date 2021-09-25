import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useSWR from 'swr';
import Box from '../Global/Box';

export default function Search() {
  const {
    data: { AvailableFilters, Directory },
  } = useSWR('/api/set/search');

  console.log(AvailableFilters, Directory);

  return (
    <Box width={0} icon={faSearch} title={`Search Manga `}>
      Search
    </Box>
  );
}
