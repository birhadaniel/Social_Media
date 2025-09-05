import { create } from 'zustand';
import { User } from './type';

interface UserStore {
  users: Record<string, User>;
  setUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: {}, // Initialize with empty object, no mock data
  setUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        [user.id.toString()]: user,
      },
    })),
  updateUser: (id, data) =>
    set((state) => ({
      users: {
        ...state.users,
        [id]: { ...state.users[id], ...data },
      },
    })),
}));