import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Add SelectValue
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  repoUrl: z.string().url("Enter a valid repository URL"),
  language: z.string().min(1, "Select a programming language"),
});

const languages = ["Python", "JavaScript", "TypeScript", "Java", "Go", "C++"];

export default function MyProjects() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([
    { id: 1, name: "Vireon Core", language: "Python", repoUrl: "https://github.com/example/vireon-core" },
    { id: 2, name: "UI Refactor", language: "TypeScript", repoUrl: "https://github.com/example/ui-refactor" },
  ]);
  const navigate = useNavigate(); // Fix: useNavigate returns a function

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data) => {
    const newProject = { id: projects.length + 1, ...data };
    setProjects([...projects, newProject]);
    setIsOpen(false);
    reset();
    navigate(`/project/${newProject.id}`); // Fix: use navigate() instead of history.push()
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
            onClick={() => navigate(`/project/${project.id}`)} // Fix: use navigate()
          >
            <CardHeader>
              <h2 className="text-lg font-semibold">{project.name}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{project.language}</p>
              <a href={project.repoUrl} target="_blank" className="text-blue-500 hover:underline">
                {project.repoUrl}
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
            <Button type="submit" className="w-full">Create Project</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
