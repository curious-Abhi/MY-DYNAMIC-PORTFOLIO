import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  clearAllSkillErrors,
  updateSkill,
  resetSkillSlice,
  deleteSkill,
  getAllSkills,
} from "@/store/slices/skillSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const ManageSkills = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };
  const { loading, skills, error, message } = useSelector(
    (state) => state.skills
  );
  const dispatch = useDispatch();

  const [proficiencyValues, setProficiencyValues] = useState({});

  const handleInputChange = (id, proficiency) => {
    setProficiencyValues((prev) => ({
      ...prev,
      [id]: proficiency,
    }));
  };

  const handleUpdateSkill = (id) => {
    const proficiency = proficiencyValues[id] || element.proficiency;
    dispatch(updateSkill({ id, proficiency }));
  };

  const handleDeleteSkill = (id) => {
    dispatch(deleteSkill(id));
  };

  // const handleDeleteSkill = (id) => {
  //   console.log("Received ID for deletion:", id);  // Debug log

  //   if (typeof id !== 'string' && typeof id !== 'number') {
  //     console.error("Invalid Skill ID (frontend):", id);
  //     return;
  //   }

  //   const numericId = typeof id === 'number' ? id : parseInt(id, 10);
  //   if (isNaN(numericId)) {
  //     console.error("Conversion to numeric ID failed:", id);
  //     return;
  //   }

  //   console.log("Deleting skill with numeric ID (frontend):", numericId);
  //   dispatch(deleteSkill(numericId));
  // };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllSkillErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetSkillSlice());
      dispatch(getAllSkills());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(getAllSkills());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Tabs defaultValue="week">
        <TabsContent value="week">
          <Card>
            <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
              <CardTitle>Manage Your Skills</CardTitle>
              <Button className="w-fit" onClick={handleReturnToDashboard}>
                Return to Dashboard
              </Button>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {skills && skills.length > 0 ? (
                skills.map((element) => (
                  <Card key={element.id}>
                    {" "}
                    <CardHeader className="text-3xl font-bold flex items-center justify-between flex-row">
                      {element.title}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2
                              onClick={() => {
                                // console.log("Element:", element); // Debug log
                                // const skillId = element.id;
                                // console.log("Element ID:", skillId); // Debug log
                                //handleDeleteSkill(skillId);
                                handleDeleteSkill(element.id);
                              }}
                              className="h-5 w-5 hover:text-red-500"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right" style={{ color: "red" }}>
                            Delete
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardHeader>
                    <CardFooter>
                      <Label className="text-2xl mr-2">Proficiency:</Label>
                      <Input
                        type="number"
                        value={
                          proficiencyValues[element.id] || element.proficiency
                        }
                        onChange={(e) =>
                          handleInputChange(element.id, e.target.value)
                        }
                        onBlur={() => handleUpdateSkill(element.id)}
                      />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div>No skills available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageSkills;
