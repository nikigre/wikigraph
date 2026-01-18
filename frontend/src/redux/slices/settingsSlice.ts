import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  theme: 'dark' | 'light'
  visibleNodeTypes: {
    valid: boolean;
    invalid: boolean;
    unknown: boolean;
    future: boolean;
  }
}

const initialState: InitialState = {
  theme: 'light',
  visibleNodeTypes: {
    valid: true,
    invalid: true,
    unknown: true,
    future: true,
  }
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    toggleNodeType: (state, action: PayloadAction<keyof InitialState['visibleNodeTypes']>) => {
      // Initialize visibleNodeTypes if it doesn't exist (for old persisted state)
      if (!state.visibleNodeTypes) {
        state.visibleNodeTypes = {
          valid: true,
          invalid: true,
          unknown: true,
          future: true,
        };
      }
      state.visibleNodeTypes[action.payload] = !state.visibleNodeTypes[action.payload];
    }
  }
})

export const { toggleTheme, toggleNodeType } = settingsSlice.actions
export default settingsSlice.reducer
