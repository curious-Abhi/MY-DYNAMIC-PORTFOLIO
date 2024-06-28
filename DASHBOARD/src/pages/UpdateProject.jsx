import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import SpecialLoadingButton from "./subcomponents/SpecialLoadingButton";
import {
  clearAllProjectErrors,
  getAllProjects,
  resetProjectSlice,
  updateProject,
} from "@/store/slices/projectSlice";
import { Button } from "@/components/ui/button";

const UpdateProject = () => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    technologies: "",
    stack: "",
    git_repo_link: "",
    deployed: "",
    project_link: "",
    projectBanner: "",
    projectBannerPreview: "",
  });

  const { error, message, loading } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/project/getall/${id}`,
          {
            withCredentials: true,
          }
        );
        const { data } = response;
        setProjectData({
          title: data.title,
          description: data.description,
          technologies: data.technologies,
          stack: data.stack,
          git_repo_link: data.git_repo_link,
          deployed: data.deployed,
          project_link: data.project_link,
          projectBanner: data.projectBanner,
          projectBannerPreview: data.projectBannerPreview,
        });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getProject();

    return () => {
      dispatch(clearAllProjectErrors());
    };
  }, [dispatch, id]);

  const handleProjectBanner = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectData({
        ...projectData,
        projectBannerPreview: reader.result,
        projectBanner: file,
      });
    };
  };

  const validateForm = () => {
    if (
      !projectData.title ||
      !projectData.description ||
      !projectData.technologies ||
      !projectData.stack ||
      !projectData.git_repo_link ||
      !projectData.deployed 
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("technologies", projectData.technologies);
    formData.append("stack", projectData.stack);
    formData.append("git_repo_link", projectData.git_repo_link);
    formData.append("deployed", projectData.deployed);
    formData.append("project_link", projectData.project_link);
    formData.append("projectBanner", projectData.projectBanner);

    dispatch(updateProject(id, formData));
  };

  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  return (
    <>
      <div className="flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4">
        <form
          onSubmit={handleUpdateProject}
          className="w-[100%] px-5 md:w-[1000px] pb-5"
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex flex-col gap-2 items-start justify-between sm:items-center sm:flex-row">
                <h2 className="font-semibold leading-7 text-gray-900 text-3xl">
                  UPDATE PROJECT
                </h2>
                <Button onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                <div className="w-full sm:col-span-4">
                  <img
                    src={
                      projectData.projectBannerPreview
                        ? projectData.projectBannerPreview
                        : "/avatarHolder.jpg"
                    }
                    alt="projectBanner"
                    className="w-full h-auto"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleProjectBanner}
                      className="avatar-update-btn mt-4 w-full"
                    />
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="MERN STACK PORTFOLIO"
                        value={projectData.title}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="Feature 1. Feature 2. Feature 3."
                        value={projectData.description}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Technologies Uses In This Project
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="HTML, CSS, JAVASCRIPT, REACT"
                        value={projectData.technologies}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            technologies: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Stack
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select
                        value={projectData.stack}
                        onValueChange={(selectedValue) =>
                          setProjectData({
                            ...projectData,
                            stack: selectedValue,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Stack" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Stack">Full Stack</SelectItem>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="PERN">PERN</SelectItem>
                          <SelectItem value="MERN">MERN</SelectItem>
                          <SelectItem value="MEAN">MEAN</SelectItem>
                          <SelectItem value="NEXT.JS">NEXT.JS</SelectItem>
                          <SelectItem value="REACT.JS">REACT.JS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Deployed
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select
                        value={projectData.deployed}
                        onValueChange={(selectedValue) =>
                          setProjectData({
                            ...projectData,
                            deployed: selectedValue,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Is this project deployed?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Github Repository Link
                  </label>
                  <div className="mt-2">
                    <div className="relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Github Repository Link"
                        value={projectData.git_repo_link}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            git_repo_link: e.target.value,
                          })
                        }
                      />
                      <Link className="absolute w-5 h-5 left-1 top-2" />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Link
                  </label>
                  <div className="mt-2">
                    <div className="relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        type="text"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Project Link"
                        value={projectData.project_link}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            project_link: e.target.value,
                          })
                        }
                      />
                      <Link className="absolute w-5 h-5 left-1 top-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {loading ? (
              <SpecialLoadingButton content={"Updating"} width={"w-52"} />
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-52"
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProject;
