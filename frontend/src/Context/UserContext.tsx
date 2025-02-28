import { getCookies, makeRequest } from "@/useful/ApiContext"
import { createContext, useContext, useEffect, useState } from "react"
import { setCookie } from "@/useful/ApiContext";


const context = createContext()



function UserContext({ children }) {

    const [user, setUser] = useState()
    const [token,settoken]=useState('')
    const usercookie=getCookies('user')
    
    useEffect(()=>{
        async function profile(){
                const {id}=usercookie
                const {data}=await makeRequest({url:`/profile/${id}`})
                // console.log(data);
                
                if(data){
                    setUser(data)
                      setCookie('user',JSON.stringify(data))
                  }

        }
        usercookie &&
        profile()
    },[])
    
    return (
        <context.Provider value={{ user, setUser,settoken,token }}>
            {children}
        </context.Provider>
    )
}

export function useAuth() {
    return useContext(context)
}

export default UserContext
