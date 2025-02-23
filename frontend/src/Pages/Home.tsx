import { makeRequest } from '@/useful/ApiContext'
import React, { useEffect } from 'react'

function Home() {

  useEffect(()=>{
    async function handlelogin(){
      // e.preventDefault()
      // const fmdata=new FormData(e.target)
        const {data}=await makeRequest({url:'/'})
      
      }
    handlelogin()
  },[])

  return (
    <>Home</>
  )
}

export default Home