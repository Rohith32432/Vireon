
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
  } from "@/components/ui/sidebar"
  import { Button } from "./ui/button"
  import { getroutes } from "@/useful/routes"
  import { useEffect, useState } from "react"
  import { useAuth } from "@/Context/userContext"
  import { Home, Inbox } from "lucide-react"
  import { Link, useNavigate } from "react-router-dom"
  import { removeCokkies } from "@/useful/ApiContext"
  
  export default function AppSidebar() {
    const navigate=useNavigate()
    const [routes,setroutes]=useState(
      [
        {
          title: "login",
          url: "/enter",
          icon: Home,
        },
        {
          title: "singup",
          url: "/enter",
          icon: Inbox,
        },
       
      ]
    )
    const {user} =useAuth()
    useEffect(()=>{
     user &&
      setroutes(getroutes(user?.role)) 
      
    },[user])
  
     function logout(){
    
      removeCokkies()
      navigate('/login')
    }
    return (
      <SidebarProvider defaultOpen={true}>
      <Sidebar variant="floating"  >
        <SidebarContent className=" bg-black rounded-lg ">
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((item) => (
                  <SidebarMenuItem key={item.title} >
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> 
        </SidebarContent>
        <SidebarFooter className="bg-black">
          {
            !user  ?
          <Link to={'/enter'} className="">
          <Button className="w-full" >Login</Button>
          </Link>
          :
          <Button className="w-full" onClick={()=>{logout()}} >Logout</Button>
  
          }
          
        </SidebarFooter>
      </Sidebar>
      </SidebarProvider>
    )
  }
  