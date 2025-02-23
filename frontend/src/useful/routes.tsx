import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

export const userRoutes = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "my-courses",
      url: "/mycourses",
      icon: Inbox,
    },
    {
      title: "stats",
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
]
 
export const instrutorRoutes=[
    {
        title: "Home",
        url: "/home",
        icon: Home,
      },
      {
        title: "Add course",
        url: "/addcourse",
        icon: Inbox,
      },
      {
        title: "your courses",
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
        title: "instx",
        url: "/setting",
        icon: Settings,
      }
]
 
export function getroutes(role :string){
    return role =='user'?userRoutes:instrutorRoutes
}
