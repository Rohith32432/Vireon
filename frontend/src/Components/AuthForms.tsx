import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/Context/UserContext";
import { makeRequest, setCookie } from "@/useful/ApiContext";
import { useState, FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const AuthForms: FC = () => {
  const [status, setStatus] = useState<boolean>(true);
  const navigate = useNavigate();
  const {setUser}=useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fmdata = new FormData(e.currentTarget);
    const { data } = await makeRequest({
      type: 'POST',
      url: '/signup',
      data: {
        email: fmdata.get('email'),
        password: fmdata.get('pwd'),
        username: fmdata.get('name'),
      },
    });
    if (data) {
      navigate('/user/enter');
      // console.log(data);
      
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fmdata = new FormData(e.currentTarget);
    const { data } = await makeRequest({
      type: 'POST',
      url: '/login',
      data: {
        email: fmdata.get('email'),
        password: fmdata.get('pwd'),
      },
    });
    if (data) {
      setCookie('user',data?.user)
      setUser(data?.user)
      navigate('/user/myprojects');
      // console.log(data);
      
    }
  };

  return (
    <div className="min-h-dvh flex justify-center items-center">
      {status ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" placeholder="Enter Email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pwd">Password</Label>
                  <Input id="pwd" name="pwd" type="password" placeholder="Enter Password" />
                </div>
                <Button>Login</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStatus(!status)}>
              Sign-Up
            </Button>
            <Button>Google</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Enter Name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter Email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pwd">Password</Label>
                  <Input id="pwd" name="pwd" type="password" placeholder="Enter Password" />
                </div>
                <Button>Sign Up</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStatus(!status)}>
              Login
            </Button>
            <Button>Google</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
