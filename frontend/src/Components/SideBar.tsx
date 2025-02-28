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
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { getRoutes } from "@/useful/routes";
import { useEffect, useState } from "react";
import { useAuth } from "@/Context/userContext";
import { Home, Inbox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { removeCookies } from "@/useful/ApiContext";

export default function AppSidebar() {
  
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([
    {
      title: "Login",
      url: "/enter",
      icon: Home,
    },
    {
      title: "Signup",
      url: "/enter",
      icon: Inbox,
    },
  ]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setRoutes(getRoutes(user.role));
    }
  }, [user]);

  function logout() {
    removeCookies();
    navigate("/login");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="floating">
        <SidebarContent className="bg-black rounded-lg">
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((item) => (
                  <SidebarMenuItem key={item.title}>
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
          {!user ? (
            <Link to="/enter">
              <Button className="w-full">Login</Button>
            </Link>
          ) : (
            <Button className="w-full" onClick={logout}>
              Logout
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
