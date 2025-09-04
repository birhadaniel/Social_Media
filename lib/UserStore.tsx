
import { create } from 'zustand';
import { User } from './type';

interface UserStore {
  users: Record<string, User>;
  updateUser: (id: string, data: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: {
    '123': {
      id: 123,
      username: 'you',
      bio: 'Welcome to my profile!',
      profilePicture: '/images/default-avatar.png',
      createdAt: new Date().toISOString(),
      followersCount: 10,
      followingCount: 20,
      postsCount: 5,
    },
    '456': {
      id: 456,
      username: 'james_smith',
      bio: 'Loving life!',
      profilePicture: '/images/avatar2.png',
      createdAt: new Date().toISOString(),
      followersCount: 50,
      followingCount: 30,
      postsCount: 8,
    },
  },
  updateUser: (id, data) =>
    set((state) => ({
      users: {
        ...state.users,
        [id]: { ...state.users[id], ...data },
      },
    })),
}));

