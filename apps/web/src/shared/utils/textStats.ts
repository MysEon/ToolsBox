export interface TextStats {
  characters: number;
  bytes: number;
  lines: number;
  words: number;
}

export function computeTextStats(text: string): TextStats {
  if (!text) return { characters: 0, bytes: 0, lines: 0, words: 0 };
  return {
    characters: text.length,
    bytes: new Blob([text]).size,
    lines: text.split('\n').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
  };
}
