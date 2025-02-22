 
import { AuthForms } from './Components/AuthForms'
import {Route, Routes}  from 'react-router-dom'
import UserContext from './Context/UserContext'
import Home from './Pages/Home'
import AppSidebar from './Components/SideBar'
import Check from './useful/Check'
import UserPage from './Components/UserPage'

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
      <Route path='page' element={<UserPage/>}/>
      </Route>
    </Routes>
          

          </div>
        </div>
  </UserContext>
  </div>

  )
}

export default App
