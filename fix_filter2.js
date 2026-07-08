const fs = require('fs');
let code = fs.readFileSync('lib/chatFilter.ts', 'utf8');

// The typescript error mentions line 67 in chatFilter.ts
// "A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value."
// It means TypeScript doesn't see the return statement, maybe because it's inside some unclosed block.
// Let's rewrite the function just to be safe.

const newFunc = `
export function filterChatMessage(text: string): string {
  let filteredText = text;
  
  for (const badWord of sortedBadWords) {
    const escapedBadWord = badWord.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    const regex = new RegExp(\`\\\\b\${escapedBadWord}\\\\b\`, 'gi');
    
    if (regex.test(filteredText)) {
       const type = badWordsDict[badWord];
       if (type.includes(' ')) {
         filteredText = filteredText.replace(regex, () => type);
       } else {
         filteredText = filteredText.replace(regex, () => getRandomReplacement(type));
       }
    }
  }

  for (const badWord of sortedBadWords) {
    if (badWord.includes('*') || badWord.includes('.') || badWord.includes('0') || badWord.includes('1') || badWord.includes('4')) {
      const escapedBadWord = badWord.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
      const regex = new RegExp(escapedBadWord, 'gi');
      if (regex.test(filteredText)) {
         const type = badWordsDict[badWord];
         filteredText = filteredText.replace(regex, () => getRandomReplacement(type));
      }
    }
  }

  return filteredText;
}
`;

code = code.replace(/export function filterChatMessage[\s\S]*?\}\n\}$/, newFunc);

fs.writeFileSync('lib/chatFilter.ts', code);
