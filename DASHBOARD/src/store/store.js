import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import forgotResetPasswordSlice from "./slices/forgotResetPasswordSlice";
import messageReducer from "./slices/messageSlice";
import timelineReducer from "./slices/timelineSlice";
import skillReducer from "./slices/skillSlice";
import softwareApplicationReducer from "./slices/softwareApplicationSlice";

export const store=configureStore({
    reducer:{
        user:userSlice,
        forgotPassword:forgotResetPasswordSlice,
        messages:messageReducer,
        timeline: timelineReducer,
        skills:skillReducer,
        softwareApplication:softwareApplicationReducer,
    }
})