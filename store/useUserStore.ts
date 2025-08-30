import { create } from "zustand";

interface UserStore {
  selectedUser: any | null;
  setSelectedUser: (user: any | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
