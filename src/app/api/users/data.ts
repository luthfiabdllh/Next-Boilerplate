import type { UserEntity } from '@/features/users/types';

// Initial seed mock users for template demonstration
export const mockUsersDatabase: UserEntity[] = [
  {
    id: 'usr_1',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-15T08:30:00.000Z',
  },
  {
    id: 'usr_2',
    name: 'Alex Murphy',
    email: 'alex.murphy@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2025-02-10T11:20:00.000Z',
  },
  {
    id: 'usr_3',
    name: 'Ellen Ripley',
    email: 'ellen.ripley@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-03-01T14:45:00.000Z',
  },
  {
    id: 'usr_4',
    name: 'John McClane',
    email: 'john.mcclane@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2025-03-12T09:15:00.000Z',
  },
  {
    id: 'usr_5',
    name: 'Dana Scully',
    email: 'dana.scully@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2025-04-05T16:00:00.000Z',
  },
  {
    id: 'usr_6',
    name: 'Fox Mulder',
    email: 'fox.mulder@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2025-04-18T10:10:00.000Z',
  },
  {
    id: 'usr_7',
    name: 'Neo Anderson',
    email: 'neo.anderson@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-05-02T13:25:00.000Z',
  },
  {
    id: 'usr_8',
    name: 'Trinity Moss',
    email: 'trinity.moss@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2025-05-14T07:40:00.000Z',
  },
];
