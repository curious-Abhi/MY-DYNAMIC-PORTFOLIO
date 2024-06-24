import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import SpecialLoadingButton from "./subcomponents/SpecialLoadingButton";
import {
  resetPassword,
  clearAllForgotPasswordErrors,
} from "@/store/slices/forgotResetPasswordSlice";

const ResetPassword = () => {
  const {token}=useParams()
  const [password,setPassword]=useState("")
  const [confirmpassword,setConfirmPassword]=useState("")
  const {loading,error,message}=useSelector((state)=>state.forgotPassword);
  const {isAuthenticated}=useSelector((state)=>state.user);
  const dispatch =useDispatch();
  const navigateTo=useNavigate();

  const handleResetPassword=()=>{
    dispatch(resetPassword(token,password,confirmpassword));
  }

  useEffect(()=>{
  if(error){
    toast.error(error)
    dispatch(clearAllForgotPasswordErrors())
  }
  if(isAuthenticated){
    navigateTo('"/')
  }
  if(message!==null){
    toast.success(message);
  }
  },[dispatch,isAuthenticated,error,loading])


  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className=" min-h-[100vh] flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-balance text-muted-foreground">
              Set a New password
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label >Password</Label>
              <Input
                
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label >Confirm Password</Label>
              <Input
              
                type="password"
            
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
  
            {!loading ? (
              <Button
                onClick={() => handleResetPassword(password,confirmpassword)}
                className="w-full"
              >
                Reset Password
              </Button>
            ) : (
              <SpecialLoadingButton content={"Resetting"} />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-muted">
        <img src="/forgot.png" alt="login" />
      </div>
    </div>
  );
}

export default ResetPassword