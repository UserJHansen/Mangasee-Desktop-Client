import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Box from '../Global/Box';

export default function Search() {
  return (
    <Box width={0} icon={faSearch} title={`Search Manga `}>
      Search
    </Box>
  );
}
