import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Route path="/" />
      <Route path="/login" element={<Login />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path="/manage/skills" element={<ManageSkills />} />
      <Route path="/manage/timeline" element={<ManageTimeline />} />
      <Route path="/manage/projects" element={<ManageProjects />} />
      <Route path="/view/project/:id" element={<ViewProject />} />
      <Route path="/update/project/:id" element={<UpdateProject />} />
    </Router>
  );
};

export default App;
