import { Post } from '../models/Post.models';

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
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Williams',
    'Emily Clark',
    'Michael Brown',
    'Jessica Miller',
    'David Wilson',
    'Laura Garcia',
    'James Anderson',
    'Rachel Moore',
    'Christopher Taylor',
    'Amanda Davis',
    'Joshua Martinez',
    'Sarah White',
    'Brian Harris',
    'Nicole Thomas',
    'Kevin Jackson',
    'Stephanie Lee',
    'Matthew Rodriguez',
    'Ashley Lewis',
    'Daniel Walker',
    'Megan Hall',
    'Aaron Allen',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export function generateRandomEmail(): string {
  const domains = [
    'example.com',
    'test.com',
    'demo.com',
    'sample.com',
    'mocksite.com',
    'testsite.com',
    'prototype.com',
    'sandbox.com',
    'trial.com',
    'alpha.com',
    'beta.com',
    'temp.com',
    'simulator.com',
    'practice.com',
    'experiment.com',
    'playground.com',
    'virtual.com',
    'temporary.com',
    'mytest.com',
    'testrun.com',
    'prelaunch.com',
    'devsite.com',
  ];

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

export function processPosts(posts: Post[]): Post[] {
  return posts.slice(0, 10).map((post) => ({
    ...post,
    body: generateRandomSentence(10),
    author: {
      name: generateRandomName(),
      email: generateRandomEmail(),
    },
    metadata: {
      createdAt: generateRandomDate(),
      updatedAt: '',
    },
    comments: [],
  }));
}
