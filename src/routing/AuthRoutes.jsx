import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function AuthRoutes ({allowListedRoles}) {
    
    const {role} = useSelector((state) => state.auth);
    return (
        <>
            {allowListedRoles.find((givenRole) => givenRole == role) ? <Outlet /> : <h1>User Not Defined</h1>}
        </>
    )
}

export default AuthRoutes;