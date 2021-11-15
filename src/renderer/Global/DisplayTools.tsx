export function chapterURLEncode(ChapterString: string) {
  let Index = '';
  const IndexString = ChapterString.substring(0, 1);
  if (IndexString !== '1') {
    Index = `-index-${IndexString}`;
  }

  const Chapter = parseInt(ChapterString.slice(1, -1), 10);

  let Odd = '';
  const OddString = ChapterString[ChapterString.length - 1];
  if (OddString !== '0') {
    Odd = `.${OddString}`;
  }

  return `-chapter-${Chapter}${Odd}${Index}`;
}

export function ChapterDisplay(ChapterString: string) {
  const Chapter = parseInt(ChapterString.slice(1, -1), 10);
  const Odd = ChapterString[ChapterString.length - 1];
  if (Odd === '0') {
    return Chapter;
  }
  return `${Chapter}.${Odd}`;
}
