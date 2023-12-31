import { defineStore } from "pinia"

export const useStore = defineStore({
    id: 'noteEdit',
    state: () => ({
        note: {},
        edit: false,
        editShow: false,
        gridRowActive: 0,
        tagId: 0
    }),
    actions: {}
})