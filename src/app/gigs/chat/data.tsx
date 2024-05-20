export const userData = [
  {
    id: 1,
    avatar: 'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
    messages: [
      {
        id: 1,
        avatar:
          'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
        name: 'Rami',
        message: 'Hey, Humza',
      },
      {
        id: 2,
        avatar:
          'https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png',
        name: 'Humza',
        message: 'Hey!',
      },
      {
        id: 3,
        avatar:
          'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
        name: 'Rami',
        message: 'How are you?',
      },
      {
        id: 4,
        avatar:
          'https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png',
        name: 'Jakob Hoeg',
        message: 'I am good, you?',
      },
      {
        id: 5,
        avatar:
          'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
        name: 'Rami',
        message: 'I am good too!',
      },
      {
        id: 6,
        avatar:
          'https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png',
        name: 'Jakob Hoeg',
        message: 'That is good to hear!',
      },
      {
        id: 7,
        avatar:
          'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
        name: 'Rami',
        message: 'How has your day been so far?',
      },
      {
        id: 8,
        avatar:
          'https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png',
        name: 'Jakob Hoeg',
        message:
          'It has been good. I went for a run this morning and then had a nice breakfast. How about you?',
      },
      {
        id: 9,
        avatar:
          'https://ca.slack-edge.com/T06BQAK427L-U06CD495HEU-4398158e9496-72',
        name: 'Rami',
        message: 'I had a relaxing day. Just catching up on some reading.',
      },
    ],
    name: 'Rami',
  },
  {
    id: 2,
    avatar: '/User2.png',
    name: 'John Doe',
  },
  {
    id: 3,
    avatar: '/User3.png',
    name: 'Elizabeth Smith',
  },
  {
    id: 4,
    avatar: '/User4.png',
    name: 'John Smith',
  },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
  id: 5,
  avatar:
    'https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png',
  name: 'Jakob Hoeg',
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
  id: number;
  avatar: string;
  name: string;
  message: string;
}

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}
