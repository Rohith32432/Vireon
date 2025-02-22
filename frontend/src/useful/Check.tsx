import { useAuth } from "@/Context/userContext"
import { Outlet } from "react-router-dom"

function Check() {
  const {user}=useAuth()
  return (
    <>
    {
        user || true?
        <Outlet/>:(

            <>
            <h1>plaese login</h1>
            </>
        )
        

    }
    </>
  )
}

export default Check