import {configureStore, createSlice} from '@reduxjs/toolkit'

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState: {language: 'RU', reducedMotion: false},
    reducers: {
        toggleLanguage: (state) => {
            state.language = state.language === 'RU' ? 'EN' : 'RU'
        },
        toggleMotion: (state) => {
            state.reducedMotion = !state.reducedMotion
        },
    },
})

export const {toggleLanguage, toggleMotion} = preferencesSlice.actions
export const store = configureStore({reducer: {preferences: preferencesSlice.reducer}})

