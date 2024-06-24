import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import forgotResetPasswordSlice from "./slices/forgotResetPasswordSlice";

export const store=configureStore({
    reducer:{
        user:userSlice,
        forgotPassword:forgotResetPasswordSlice
    }
})