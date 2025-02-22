import axios from "axios";
import Cookie from "universal-cookie"

const baseurl = import.meta.env.VITE_APP_BACKEND_URL
const cookies = new Cookie(null, { path: '/' })
interface defaultopts {
    type?: string,
    url: string,
    token?: string,
    data?: {} | [],
    formdata?:boolean
}
const axiosinstance = axios.create({
    baseURL: baseurl,
})

export function getCookies(name:string) {
    let token = cookies.get(name)
    if (token) return token
    return null
}


export function setcookie(name: string, value: string) {
    cookies.set(name, value)
    return 'cookie saved sucessful'
}

export function removeCokkies(){
    ['token','user'].forEach((e)=>{
        cookies.remove(e)
    })
}

export function makeRequest({ type = 'GET', url, data ,formdata}: defaultopts) {
    const token = getCookies('token')
    let fm
    if(formdata){
         fm=new FormData()
       for(let key in data){
        fm.append(key,data[key])
       }
       
    }
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            ...(formdata ? {} : { 'Content-Type': 'application/json' })
        }
    };

    if (type == 'GET') {
        return axiosinstance.get(url, config)
    }
    else {
        if(formdata){
            console.log(fm);
            
            return axiosinstance.post(url, fm, config)
        }
        else{
            return axiosinstance.post(url, data, config)

        }
    }
}