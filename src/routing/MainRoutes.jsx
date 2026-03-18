import { Route,Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home";
import ListAllUsers from "../pages/users/ListAllUsers";
import AuthRoutes from "./AuthRoutes";


function MainRoutes () {
    return (
        <Routes>
            <Route path="/" element={ <Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route  element={<AuthRoutes allowListedRoles={["admin", ]}/>}>  
                <Route path='/users' element={<ListAllUsers />}/>
            </Route>
            <Route path="/dashboard" element={<Dashboard />}/>

        </Routes>
    )

}

export default MainRoutes;