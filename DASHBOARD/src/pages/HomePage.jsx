import React from 'react'

const HomePage = () => {
  return (
    <>
    
    </>
  )
}

export default HomePage
















/*
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { clearAllUsersErrors, logout } from '@/store/slices/userSlice'

const HomePage = () => {
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUsersErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message, dispatch]);

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default HomePage;

*/