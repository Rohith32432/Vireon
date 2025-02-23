

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { makeRequest } from "@/useful/ApiContext"
import { useState } from "react"

export function AuthForms() {

  const [status,setstatus]=useState(true)

async function handlesubmit(e){
    e.preventDefault()
    const fmdata=new FormData(e.target)
    const {data}=await makeRequest({type:'post', url:'/signup',data:{email:fmdata.get('email'),password:fmdata.get('pwd'),username:fmdata.get('name')}})
    console.log(data);
    
}
async function handlelogin(e){
  e.preventDefault()
  const fmdata=new FormData(e.target)
    const {data}=await makeRequest({url:'/login',data:{email:fmdata.get('email'),password:fmdata.get('pwd')}})
  
  }


  return (
    <div className="min-h-dvh flex justify-center items-center">
      {
        status?
    <Card className="w-[350px]">
      
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent >
        <form onSubmit={handlelogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="name" type="email" name="email" placeholder="Enter Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pwd">Password</Label>
              <Input id="name" name="pwd" placeholder="Name of your project" />
            </div>
          <Button>login</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={()=>{setstatus(!status)}}>Sign-Up</Button>
        <Button>google</Button>
      </CardFooter>
    </Card>
    : <>
    <Card className="w-[350px]">
      
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent >
        <form onSubmit={handlesubmit}>
          <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Name</Label>
              <Input id="name" name="name" type="text" placeholder="Enter Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="name" name='email' type="email" placeholder="Enter Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pwd">Password</Label>
              <Input id="name" name="pwd" placeholder="Name of your project" />
            </div>
          <Button>Sign Up</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={()=>{setstatus(!status)}}>Login</Button>
        <Button>google</Button>
      </CardFooter>
    </Card>
    </>
      }
    </div>
  )
}
