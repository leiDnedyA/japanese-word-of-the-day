
export async function getJlptLevelWordCount(level = 1) {
  if (level < 1 || level > 5) {
    throw new Error(`Error, invalid JLPT level ${level}.`)
  }
  // get the total count
  const response = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${level}&limit=1`)
  const data = await response.json();
  return data.total;
}

export async function getJlptWord(index, level = 1) {
  const response = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${level}&offset=${index}&limit=1`)
  const data = await response.json();
  return data.words[0];
}

