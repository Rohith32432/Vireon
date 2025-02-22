 
import { AuthForms } from './Components/AuthForms'
import {Route, Routes}  from 'react-router-dom'
import UserContext from './Context/UserContext'
import Home from './Pages/Home'
import AppSidebar from './Components/SideBar'
import Check from './useful/Check'
import UserPage from './Components/UserPage'
import MyProjects from './Pages/MyProjects'
import Project from './projects/Project'
import FlowChart from './Components/FlowChart'

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
      <Route path='page' element={<MyProjects/>}/>
      <Route path='x' element={<FlowChart/>}/>
      <Route path='project/:id' element={<Project/>} />
      </Route>
      <Route path='*' element={<h1>Not Found</h1>}/>
    </Routes>
          

          </div>
        </div>
  </UserContext>
  </div>

  )
}

export default App
