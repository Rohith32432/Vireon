import React, { useEffect, useState, FC } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "reactflow/dist/style.css";
import { makeRequest } from "@/useful/ApiContext";

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

const Project: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await makeRequest({ url: `/ast?username=test_user&project_name=${id}` });
        const { data } = response;
        setProject({
          id: data.project_id,
          name: data.project_name,
          repoUrl: data.repo_url,
          language: "Python", // Replace with actual language if available
          contributors: [], // Replace with actual contributors if available
          lastUpdated: "2023-01-01", // Replace with actual date if available
          status: "Active", // Replace with actual status if available
          insights: "AI insights here", // Replace with actual insights if available
          flowData: data.call_trees, // Replace with actual flow data if available
          executionSteps: [] // Replace with actual execution steps if available
        });
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.language}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Repository:{" "}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {project.repoUrl}
            </a>
          </p>
          <p className="text-sm">Last Updated: {project.lastUpdated}</p>
          <p className={`text-sm font-semibold ${project.status === "Active" ? "text-green-600" : "text-red-600"}`}>
            Status: {project.status}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="visualization">
        <TabsList>
          <TabsTrigger value="visualization">Code Flow</TabsTrigger>
          <TabsTrigger value="debugging">AI Insights</TabsTrigger>
          <TabsTrigger value="execution">Execution Tracking</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          {/* TODO: Render ReactFlow visualization using project.flowData */}
        </TabsContent>

        <TabsContent value="debugging">
          <p className="text-sm text-gray-600">{project.insights}</p>
        </TabsContent>

        <TabsContent value="execution">
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {project.executionSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="contributors">
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {project.contributors.map((contributor, index) => (
              <li key={index}>{contributor}</li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Project;
