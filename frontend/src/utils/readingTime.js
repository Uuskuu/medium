/**
 * Calculate reading time for a given text content
 * Average reading speed: 200 words per minute (Mongolian)
 * @param {string} content - The text content (can be Draft.js JSON or plain text)
 * @returns {number} - Reading time in minutes
 */
export const calculateReadingTime = (content) => {
  if (!content) return 1;

  let text = '';
  
  try {
    // Try to parse as Draft.js JSON
    const contentState = JSON.parse(content);
    if (contentState.blocks && Array.isArray(contentState.blocks)) {
      text = contentState.blocks
        .map(block => block.text || '')
        .join(' ');
    } else {
      text = content;
    }
  } catch (e) {
    // If parsing fails, treat as plain text
    text = content;
  }

  // Remove extra whitespace
  text = text.trim().replace(/\s+/g, ' ');
  
  // Count words (split by whitespace)
  const wordCount = text.split(' ').filter(word => word.length > 0).length;
  
  // Calculate reading time (200 words per minute for Mongolian)
  const readingTime = Math.ceil(wordCount / 200);
  
  // Minimum 1 minute
  return readingTime || 1;
};

/**
 * Format reading time for display
 * @param {number} minutes - Reading time in minutes
 * @returns {string} - Formatted string
 */
export const formatReadingTime = (minutes) => {
  if (minutes < 1) return '1 минут унших';
  return `${minutes} минут унших`;
};

/**
 * Calculate and format reading time in one call
 * @param {string} content - The text content
 * @returns {string} - Formatted reading time string
 */
export const getReadingTime = (content) => {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
};

