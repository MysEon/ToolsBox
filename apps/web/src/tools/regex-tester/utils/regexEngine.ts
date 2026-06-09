export interface RegexMatch {
  id: string;
  match: string;
  index: number;
  endIndex: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface RegexEvaluation {
  isValid: boolean;
  error?: string;
  matches: RegexMatch[];
}

function normalizeFlags(flags: string): string {
  return Array.from(new Set(flags.replace(/[^gimsu]/g, '').split(''))).join('');
}

function createMatch(result: RegExpExecArray, ordinal: number): RegexMatch {
  const matchText = result[0];
  const namedGroups = result.groups ? { ...result.groups } : undefined;

  return {
    id: `${result.index}-${ordinal}-${matchText.length}`,
    match: matchText,
    index: result.index,
    endIndex: result.index + matchText.length,
    groups: result.slice(1),
    ...(namedGroups && Object.keys(namedGroups).length > 0 ? { namedGroups } : {}),
  };
}

export function evaluateRegex(pattern: string, flags: string, input: string): RegexEvaluation {
  if (!pattern) {
    return {
      isValid: true,
      matches: [],
    };
  }

  try {
    const normalizedFlags = normalizeFlags(flags);
    const regex = new RegExp(pattern, normalizedFlags);
    const matches: RegexMatch[] = [];

    if (normalizedFlags.includes('g')) {
      let result: RegExpExecArray | null;
      let ordinal = 0;

      while ((result = regex.exec(input)) !== null) {
        matches.push(createMatch(result, ordinal));
        ordinal += 1;

        // Guard against infinite loops for zero-length global matches.
        // Examples: /^/gm, /\b/g, /(?=a)/g can return an empty match while
        // leaving lastIndex unchanged, so move forward manually.
        if (result[0] === '') {
          regex.lastIndex += 1;
        }
      }
    } else {
      const result = regex.exec(input);
      if (result) {
        matches.push(createMatch(result, 0));
      }
    }

    return {
      isValid: true,
      matches,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : '无效的正则表达式',
      matches: [],
    };
  }
}
