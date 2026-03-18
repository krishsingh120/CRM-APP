
import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {login} from '../../Redux/Slices/AuthSlice'


function Login () {

    const dispatch = useDispatch();
    const navigator = useNavigate()

    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    })


    function resetLoginState () {
        setLoginDetails({
            email: "",
            password: ""
        })
    }

    async function onSubmit () {
        if(!loginDetails.email || !loginDetails.password) return;
        const response = await dispatch(login(loginDetails))
        console.log("login details", loginDetails)
        if(response.payload) navigator('/')
        else resetLoginState()
    }

    function handleInputChange (e) {
        const {name, value} = e.target;
        // console.log(name, value)
        setLoginDetails({...loginDetails, [name]: value})
    }

    return (
        <>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-7 text-center mb-4 mt-5">
                        <h3>Login Here</h3>
                    </div>

                    <div className="col-lg-7  mb-3">
                        <input type="text" 
                         className="form-control" 
                         placeholder="Email.."
                         onChange={handleInputChange}
                         name='email'
                         value={loginDetails.email}
                         
                         />
                    </div>
                    <div className="col-lg-7  mb-4">
                        <input type="text"  
                        className="form-control" 
                        placeholder="Password.."
                        onChange={handleInputChange}
                        name='password'
                        value={loginDetails.password}
                        />
                    </div>

                    <div className="col-lg-7 d-grid">
                        <button className="btn btn-success" onClick={onSubmit}>Submit</button>
                    </div>
                    <div className="col-lg-7 d-grid mt-2">
                        <button className="btn btn-primary">Already have an account <Link to={'/signup'} className=" text-white mx-2">SignUp here.</Link></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;