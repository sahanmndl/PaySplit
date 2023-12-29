import {create} from 'zustand';
import {produce} from 'immer';

export const useCurrentUserStore = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set(produce((state) => {
        state.currentUser = user;
    }))
}))
