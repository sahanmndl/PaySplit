import {create} from "zustand";

export const useCurrentUserStore = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({currentUser: user}),
}));