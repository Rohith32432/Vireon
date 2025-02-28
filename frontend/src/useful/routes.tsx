import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const userRoutes = [
  {
    title: "Home",
    url: "/user/home",
    icon: Home,
  },
  {
    title: "My projects",
    url: "user/myprojects",
    icon: Inbox,
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
  return role === "user" || true ? userRoutes : instructorRoutes;
}
