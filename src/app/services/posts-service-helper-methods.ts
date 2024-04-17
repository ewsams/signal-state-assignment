export const randomSentenceWords = [
  'post',
  'new',
  'color',
  'open',
  'apple',
  'design',
  'create',
  'launch',
  'innovate',
  'manage',
  'build',
  'enhance',
  'develop',
  'connect',
  'discover',
  'achieve',
  'lead',
  'grow',
  'inspire',
  'improve',
  'succeed',
  'adjust',
  'maintain',
  'integrate',
  'optimize',
];

export function generateRandomName(): string {
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams'];
  return names[Math.floor(Math.random() * names.length)];
}

export function generateRandomEmail(): string {
  const domains = ['example.com', 'test.com', 'demo.com'];
  const randomString = Math.random().toString(36).substring(7);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomString}@${domain}`;
}

export function generateRandomDate(): string {
  const start = new Date(2022, 0, 1);
  const end = new Date();
  const randomTimestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTimestamp);
  return randomDate.toISOString();
}

export function generateRandomSentence(wordCount: number): string {
  return Array.from(
    { length: wordCount },
    () =>
      randomSentenceWords[
        Math.floor(Math.random() * randomSentenceWords.length)
      ]
  ).join(' ');
}
