import { createContext, useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router,Route,Link, Routes, useParams, useNavigate} from 'react-router-dom'
import './App.css'
import {DetailPage} from './pages/detailpage.js'
import {ListPage} from './pages/listpage'
console.log('app.js')

function App() {
    return <Router>
        <Link to="/"></Link>
        <Routes>
            <Route path='*' element={<ListPage ></ListPage>}></Route>
            <Route path='/details/:id' element={<DetailPage ></DetailPage>}></Route>
        </Routes>
    </Router>
}


export default App;
