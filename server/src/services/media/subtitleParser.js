/**
 * Smartly groups words into cinematic subtitle segments.
 *
 * Rules:
 * 1. Max Characters: ~40 chars per line (Standard readability).
 * 2. Max Duration: ~3 seconds per segment (Prevents text staying too long).
 * 3. Silence Detection: If there is > 0.4s silence between words, split.
 * 4. Punctuation: Always split on Sentence Enders (. ? !). Split on commas (,) only if line is getting long.
 *
 * @param {Array} words - [{ word: "The", start: 0.0, end: 0.1 }, ...]
 * @returns {Array} - [{ text: "The car is fast", start: 0.0, end: 1.5 }, ...]
 */
function parseSubtitles(words) {
  if (!words || words.length === 0) return [];

  const segments = [];

  // CONFIGURATION (Cinematic Standards)
  const MAX_CHARS = 42; // Max visual width
  const MAX_DURATION = 3.5; // Max time a subtitle stays on screen
  const MIN_SILENCE = 0.3; // Gap between words to force a split (seconds)

  let currentSegment = {
    words: [],
    text: "",
    start: words[0].start,
    end: words[0].end,
  };

  for (let i = 0; i < words.length; i++) {
    const wordObj = words[i];
    const prevWord = i > 0 ? words[i - 1] : null;

    // --- DECISION LOGIC: SHOULD WE SPLIT? ---
    let shouldSplit = false;

    // 1. Silence Check: Is there a pause before this word?
    if (prevWord) {
      const silenceGap = wordObj.start - prevWord.end;
      if (silenceGap > MIN_SILENCE) shouldSplit = true;
    }

    // 2. Length Check: Will adding this word exceed max chars?
    // We add 1 for the space
    if (currentSegment.text.length + wordObj.word.length + 1 > MAX_CHARS) {
      shouldSplit = true;
    }

    // 3. Duration Check: Is the current segment already too long in time?
    if (wordObj.end - currentSegment.start > MAX_DURATION) {
      shouldSplit = true;
    }

    // 4. Punctuation Check (Previous word ended a sentence)
    if (prevWord && /[.?!]/.test(prevWord.word)) {
      shouldSplit = true;
    }

    // 5. Comma Check (Soft Split): Split on comma ONLY if segment is already substantial (> 15 chars)
    if (
      prevWord &&
      /[,]/.test(prevWord.word) &&
      currentSegment.text.length > 15
    ) {
      shouldSplit = true;
    }

    // --- EXECUTE SPLIT OR APPEND ---
    if (shouldSplit) {
      // Push finished segment
      segments.push({
        text: currentSegment.text.trim(),
        start: currentSegment.start,
        end: prevWord.end, // End exactly at the last word
      });

      // Reset for new segment
      currentSegment = {
        words: [wordObj],
        text: wordObj.word,
        start: wordObj.start,
        end: wordObj.end,
      };
    } else {
      // Append to current
      currentSegment.words.push(wordObj);
      if (currentSegment.text.length > 0) {
        currentSegment.text += " ";
      }
      currentSegment.text += wordObj.word;
      currentSegment.end = wordObj.end;
    }
  }

  // Push the final dangling segment
  if (currentSegment.text.length > 0) {
    segments.push({
      text: currentSegment.text.trim(),
      start: currentSegment.start,
      end: currentSegment.end,
    });
  }

  return segments;
}

module.exports = { parseSubtitles };
