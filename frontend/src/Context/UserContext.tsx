import { getCookies, makeRequest, setcookie } from "@/useful/ApiContext"
import { createContext, useContext, useEffect, useState } from "react"

const context = createContext()



function UserContext({ children }) {

    const [user, setUser] = useState()
    const [token,settoken]=useState('')
    const usercookie=getCookies('user')
    
    useEffect(()=>{
        async function profile(){
                const {role,_id}=usercookie
                const {data}=await makeRequest({url:`/${role =='user'?'users':'instructors'}/profile/${_id}`})
                console.log(data);
                
                if(data){
                    setUser(data)
                      setcookie('user',JSON.stringify(data))
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
