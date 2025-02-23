import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import "reactflow/dist/style.css";
import axios from "axios";

interface ProjectDetails {
  id: number;
  name: string;
  repoUrl: string;
  language: string;
  contributors: string[];
  lastUpdated: string;
  status: string;
  insights: string;
  flowData: any; // Graph data for ReactFlow
  executionSteps: string[]; // Execution tracking
}

const Project: React.FC = () => {
  const { id } = useParams<{ id: any }>();
  const [project, setProject] = useState<ProjectDetails | null>({
name:'nvjn',
language:'f',
repoUrl:'http://localhost:5173/user/project/1',
lastUpdated:'nn',
status:'jn',
executionSteps:[],
contributors:[]

  });
  const [loading, setLoading] = useState<boolean>(true);
  console.log(id);
  
  // useEffect(() => {
  //   // Simulating API fetch
  //   axios.get(`/api/projects/${id}`)
  //     .then((response) => {
  //       setProject(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching project details:", error);
  //       setLoading(false);
  //     });
  // }, [id]);



  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.language}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Repository: <a href={project.repoUrl} className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
          <p className="text-sm">Last Updated: {project.lastUpdated}</p>
          <p className={`text-sm font-semibold ${project.status === "Active" ? "text-green-600" : "text-red-600"}`}>
            Status: {project.status}
          </p>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="visualization">
        <TabsList>
          <TabsTrigger value="visualization">Code Flow</TabsTrigger>
          <TabsTrigger value="debugging">AI Insights</TabsTrigger>
          <TabsTrigger value="execution">Execution Tracking</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
        </TabsList>

        
        <TabsContent value="debugging">
          <p className="text-sm text-gray-600">{project?.insights}</p>
        </TabsContent>

        <TabsContent value="execution">
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {project?.executionSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="contributors">
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {project?.contributors.map((contributor, index) => (
              <li key={index}>{contributor}</li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Project;