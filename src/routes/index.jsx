import { Route, Routes } from 'react-router-dom'

import Header from '../components/Header'
import Login from '../components/Login'
import Authenticated from '../components/Authenticated'
import Rejected from '../components/Rejected'
import Admin from '../components/Admin/Admin'
import CheckUser from '../components/CheckUser/CheckUser'
import Verified from '../components/Verified'
import VerifyMFA from '../components/Verifymfa/Verifymfa'
import CreateMFA from '../components/CreateMFA/CreateMFA'

export default function Main() {
    return(
        <div className='App'>
            <Header />
            <main>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/authenticated' element={<Authenticated />} />
                    <Route path='/notFound' element={<Rejected />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/checkuser' element={<CheckUser />} />
                    <Route path='/verified' element={<Verified />} />
                    <Route path='/verifymfa' element={<VerifyMFA />} />
                    <Route path='/createmfa' element={<CreateMFA />} />
                </Routes>
            </main>
        </div>
    )
}