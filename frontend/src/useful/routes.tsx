import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const userRoutes = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "My Courses",
    url: "/mycourses",
    icon: Inbox,
  },
  {
    title: "Stats",
    url: "/stats",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: Settings,
  },
];

export const instructorRoutes = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Add Course",
    url: "/addcourse",
    icon: Inbox,
  },
  {
    title: "Your Courses",
    url: "/mycourses",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: Settings,
  },
  {
    title: "Instx",
    url: "/setting",
    icon: Settings,
  },
];

export function getRoutes(role: string) {
  return role === "user" ? userRoutes : instructorRoutes;
}
