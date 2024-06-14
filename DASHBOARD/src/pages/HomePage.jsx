import { Button } from '@/components/ui/button'
import { clearAllUsersErrors, logout } from '@/store/slices/userSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const HomePage = () => {
  const dispatch=useDispatch();
  const handleLogout=()=>{
    dispatch(logout)
  }
  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearAllUsersErrors())
    }
    
  })
  return (
   <>
   <Button onClick={handleLogout}/>
   </>
  )
}

export default HomePage