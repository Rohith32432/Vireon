 
import { AuthForms } from './Components/AuthForms'
import {Route, Routes}  from 'react-router-dom'
import UserContext from './Context/UserContext'
import Home from './Pages/Home'
import AppSidebar from './Components/SideBar'
import Check from './useful/Check'
import UserPage from './Components/UserPage'
<<<<<<< HEAD
import MyProjects from './Pages/MyProjects'
import FlowChart from './Components/FlowChart'
=======
import MyProjects from './projects/MyProjects'
import Project from './projects/Project'
>>>>>>> 13ca4760ecdd98ded58a53636ad18f5121e737ca

function App() {
 
  return (
  <div className='min-h-dvh bg-background '>

  <UserContext>
  <div className='flex'>
          <div>
              <AppSidebar />
          </div>
          <div className='flex-1 w-full  m-1 h-max'>
          
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/enter' element={<AuthForms/>}/>
      <Route element={<Check/>} path='/user'>
      <Route path='home' element={<Home/>}/>
<<<<<<< HEAD
      <Route path='page' element={<MyProjects/>}/>
      <Route path='x' element={<FlowChart/>}/>
      
=======
      <Route path='page' element={<UserPage/>}/>
      <Route path='myprojects' element={<MyProjects/>}/>
      <Route path='project/:id' element={<Project/>} />
>>>>>>> 13ca4760ecdd98ded58a53636ad18f5121e737ca
      </Route>
    </Routes>
          

          </div>
        </div>
  </UserContext>
  </div>

  )
}

export default App
