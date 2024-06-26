import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import forgotResetPasswordSlice from "./slices/forgotResetPasswordSlice";
import messageReducer from "./slices/messageSlice";

export const store=configureStore({
    reducer:{
        user:userSlice,
        forgotPassword:forgotResetPasswordSlice,
        messages:messageReducer,
    }
})