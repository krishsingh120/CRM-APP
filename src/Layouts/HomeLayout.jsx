
import { AiOutlineMenu } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../Redux/Slices/AuthSlice";





function HomeLayout ({ children }) {

    const authState = useSelector((state) => state.auth);
    
    const dispatch = useDispatch()
    const navigator = useNavigate()
    // console.log("this is the authState ", authState)

    function onLogout () {
        dispatch(login)
        navigator('/login')
    }
    return (
        <>
            
            <div className="d-flex justify-content-start">

                <div>

                
                    <button className="btn btn-primary m-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <AiOutlineMenu />
                    </button>

                    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">Dashboard</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div>
                        <Link to={'/'}><h3 className="mb-3 text-center">Home</h3></Link>
                        <Link to={'/dashboard'}><h4 className="mb-3 text-center">Dashboard</h4></Link>
                        <Link to={'/users'}><h4 className="mb-3 text-center">All Users</h4></Link>
                        </div>
                        
                                {
                                    authState.isLoggedIn == false ? (
                                        <>  
                                            <div className="d-flex justify-content-around mt-5">
                                                <Link  to="/login" className="btn btn-primary" >Login</Link>
                                                <Link  to="/signup" className="btn btn-secondary" >SignUp</Link>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-around mt-5">
                                                <button onClick={onLogout} className="btn btn-success" >LogOut</button>
                                                <button className="btn btn-secondary" >Profile</button>
                                            </div>

                                        </>
                                    )
                                }

                               


                        
                    </div>
                </div>

                </div>

                    <div className="mx-5 px-5 mt-2 d-flex justify-content-between">
                        {children}  
                        {/* {children}  
                        {children}  
                        {children}   */}
                    </div>
                    
                </div>
            </>
    )
}

export default HomeLayout;