// summarizeTool.js
export async function handleSummarizeEmail({ emailText }) {
  const summary = emailText.split('. ')[0] + '.';
  return { summary };
}
