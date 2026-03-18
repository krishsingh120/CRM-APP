import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {signup} from '../../Redux/Slices/AuthSlice'

function SignUp () {

    const navigator = useNavigate()
    const dispatch = useDispatch()
    const { register, formState: { errors }, handleSubmit } = useForm();
 
    const [signupDetails, setSignupDetails] = useState({

        name: "",
        email: "",
        password: "",
        userType: "",
        userStatus: "",
        clientName: "",
    })

    function handleInputChange (e) {
        const {name, value} = e.target;
        setSignupDetails({...signupDetails, [name] : value})
        // console.log("signup details", signupDetails)
    }


    function handleUserType (e) {
        // console.log(e.target.textContent)
        
        const userTypeSelected = e.target.textContent;
        setSignupDetails({
            ...signupDetails, 
            userType: userTypeSelected,
            userStatus: (userTypeSelected === "customer") ? "approved" : "suspended"
        });
    }
    function resetSignupState () {
        setSignupDetails({
            name: "",
            email: "",
            password: "",
            userType: "",
            userStatus: "",
            clientName: "",
        })
    }


    async function handleFormSubmission (data) {
        
        setSignupDetails({...signupDetails, name: data.name, password: data.password, clientName: data.clientName})
        if(!signupDetails.email ||
           !signupDetails.password ||
           !signupDetails.name ||
           !signupDetails.userStatus ||
           !signupDetails.userType ||
           !signupDetails.clientName) return;
           const response = await dispatch(signup(signupDetails))
           if (response.payload){
            navigator('/login')

           } 
           else {
            resetSignupState()
           } 

    }

    return (
        <>
            <div className="container">
                <div className="row d-flex justify-content-start">
                    <div className="col-lg-7 text-center mb-4 mt-5">
                        <h3>SignUp Here</h3>
                    </div>

                        <form onSubmit={handleSubmit(handleFormSubmission)}>

                            <div className="col-lg-7  mb-3">
                                <input type="text"  className="form-control" placeholder="User Name.."
                                    name="name"
                                    {...register("name", { required: true, minLength: 4 })}
                                />
                            </div>
                            <div>    
                                {errors.name && errors.name.type == 'minLength' && <p className="text-danger">Name:- requires min 4 characters</p>}
                            </div>
                            <div className="col-lg-7  mb-3">
                                <input type="text"  className="form-control" placeholder="Email.."
                                    name="email"
                                    onChange={handleInputChange}
                                    value={signupDetails.email}
                                />
                            </div>

                            <div className="col-lg-7  mb-4">
                                <input type="text"  className="form-control" placeholder="Password.."
                                    name="password"
                                    {...register("password", { required: true, minLength: 5 })}
                            
                                />
                            </div>
                            <div>    
                                {errors.password && errors.password.type == 'minLength' && <p className="text-danger">Password:- requires min 5 characters</p>}
                            </div>

                            <div className="col-lg-7  mb-3">
                                <input type="text"  className="form-control" placeholder="Client Name.."
                                        name="clientName"
                                        {...register("clientName", { required: true, minLength: 5 })}
                            
                                />
                            </div>
                            <div>    
                                {errors.clientName && errors.clientName.type == 'minLength' && <p className="text-danger">Client Name:- requires min 5 characters</p>}
                            </div>
                            
                            <div className="col-lg-7  mb-3">
                                <input type="text"  className="form-control"
                                value={signupDetails.userType} 
                                name="userType"
                                onChange={handleInputChange}
                                placeholder="User Type.."  disabled/>

                            </div>

                            <div className="col-lg-7">
                                <div className="dropdown d-flex justify-content-end mb-2">
                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {(!signupDetails.userType) ? "User Type" : signupDetails.userType}
                                </a>

                                <ul className="dropdown-menu" onClick={handleUserType}>
                                    <li><a className="dropdown-item" href="#">customer</a></li>
                                    <li><a className="dropdown-item" href="#">engineer</a></li>
                                    <li><a className="dropdown-item" href="#">admin</a></li>
                                </ul>
                                </div>
                            </div>

                            <div className="col-lg-7 d-grid">
                                <button className="btn btn-success">Submit</button>
                            </div>

                        

                        <div className="col-lg-7 d-grid mt-2">
                            <button className="btn btn-primary" >Already have an account <Link to={'/login'} className=" text-white mx-2">Login here.</Link></button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;