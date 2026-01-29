/**
 * Groups individual words into readable subtitle segments.
 *
 * Strategy:
 * 1. Accumulate words until we hit a punctuation mark (. ? !)
 * 2. OR until we hit a max character limit (e.g. 40 chars)
 * 3. Preserve the exact 'start' of the first word and 'end' of the last word.
 *
 * @param {Array} words - [{ word: "The", start: 0.0, end: 0.1 }, ...]
 * @returns {Array} - [{ text: "The car is fast", start: 0.0, end: 1.5 }, ...]
 */
function parseSubtitles(words) {
  if (!words || words.length === 0) return [];

  const segments = [];
  let currentSegment = {
    text: "",
    start: words[0].start,
    end: words[0].end,
    wordCount: 0,
  };

  const MAX_WORDS_PER_SEGMENT = 5; // Adjust for faster/slower reading

  words.forEach((wordObj, index) => {
    const isLastWord = index === words.length - 1;

    // Append word to current text (add space if not start)
    if (currentSegment.text.length > 0) {
      currentSegment.text += " ";
    }
    currentSegment.text += wordObj.word; // Deepgram includes punctuation in the word string

    // Update the end time to the current word's end
    currentSegment.end = wordObj.end;
    currentSegment.wordCount++;

    // CHECK: Should we "Cut" the segment here?
    // Cut if:
    // 1. It ends with a strong punctuation (. ? !)
    // 2. We hit the max word count
    // 3. It's the very last word of the script
    const hasPunctuation = /[.?!]/.test(wordObj.word);
    const isFull = currentSegment.wordCount >= MAX_WORDS_PER_SEGMENT;

    if (hasPunctuation || isFull || isLastWord) {
      // Push the finished segment
      segments.push({ ...currentSegment });

      // Reset for next segment (if there are more words)
      if (!isLastWord) {
        const nextWord = words[index + 1];
        currentSegment = {
          text: "",
          start: nextWord ? nextWord.start : 0,
          end: nextWord ? nextWord.end : 0,
          wordCount: 0,
        };
      }
    }
  });

  return segments;
}

module.exports = { parseSubtitles };
