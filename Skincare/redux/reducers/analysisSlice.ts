"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: null,
  visitCount: null,
};

export const analysisSlice: any = createSlice({
  name: "analysisSlice",
  initialState,
  reducers: {
    saveOnboardingQuestions: (state, action) => {
      state.questions = action.payload;
    },
    updateVisitCount: (state, action) => {
      state.visitCount = action.payload;
    },
  },
});

export const { saveOnboardingQuestions, updateVisitCount } =
  analysisSlice.actions;
export default analysisSlice.reducer;
