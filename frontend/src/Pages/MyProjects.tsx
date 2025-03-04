import React, { useState, FC, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeRequest } from "@/useful/ApiContext";
import { useAuth } from "@/Context/UserContext";

// Define form validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  repoUrl: z.string().url("Enter a valid repository URL"),
  language: z.string().min(1, "Select a programming language"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const languages: string[] = ["Python", "JavaScript", "TypeScript", "Java", "Go", "C++"];

const MyProjects: FC = () => {
  const {user}=useAuth()
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<any>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });
  useEffect(()=>{
   async function getuserprjs(user:any){
    
      const {data,status} = await makeRequest({
        url: `/userprjs/${user?.id}`,
      });
      if(data){
        console.log(data);
        setProjects(data)
      }
    }
  user &&    getuserprjs(user)

    
  },[user])

  const onSubmit = async (datax: ProjectFormData) => {
    const {data,status} = await makeRequest({
      type: 'post',
      url: "/repo/parse",
      data: {
        repo_url: datax.repoUrl,
        username: user?.username, // Replace with actual username
        project_name: datax.name,
      },
    });
    if(status==200){
        const newProject = { id: data?.project_id, ...data };
        setProjects([...projects, newProject]);
        setIsOpen(false);
        reset();
        navigate(`/user/project/${newProject.id}?name=${newProject?.project_name}`);

    }
    // if (response.data) {
    // }
    console.log(data);
    
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button onClick={() => setIsOpen(true)}>+ Create Project</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg"
            onClick={() => navigate(`/user/project/${project.id}?name=${project?.project_name}`)}
          >
            <CardHeader>
              <h2 className="text-lg font-semibold">{project?.project_name}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{project.username}</p>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {project.repo_url}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Project Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input {...register("name")} placeholder="Enter project name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Repository URL</label>
              <Input {...register("repoUrl")} placeholder="Enter Git/SVN URL" />
              {errors.repoUrl && <p className="text-red-500 text-sm">{errors.repoUrl.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Programming Language</label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;
