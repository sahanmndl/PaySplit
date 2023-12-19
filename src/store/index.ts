import {create} from "zustand";

export const useSelectedMembersStore = create((set) => ({
    selectedMembers: [],
    toggleSelectedMember: (item) =>
        set((state) => ({
            selectedMembers: state.selectedMembers.includes(item)
                ? state.selectedMembers.filter((member) => member._id !== item._id)
                : [...state.selectedMembers, item],
        })),
}));
