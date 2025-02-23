import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { SkeletonCard } from './Skletions'

function UserPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-xl p-6  rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-4 capitalize">Enter URL</h1>
        <form className=" flex gap-4">
          <Input type="text" className="w-full p-3 border-2rounded-lg" />
          <Button className="p-3 rounded-lg transition duration-200">
            Submit
          </Button>
        </form>
      </div>
      <div className="flex-1">
    <SkeletonCard/>

      </div>
    </div>
  )
}

export default UserPage
