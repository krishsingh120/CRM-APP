import './Card.css'

import { useNavigate } from 'react-router-dom';



function Card ({ children, titleText = "", quantity= "0" }) {
    

    const navigator = useNavigate()
    function onCardClick () {
        navigator(`/dashboard?status=${titleText}`)
    }
    return (
        <>
            <div className="wrapper" onClick={onCardClick}>
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-4">
                            <div className='card-wrapper'>
                                <div className='card-upper-part d-flex justify-content-center align-items-center mt-3 gap-3'>
                                    {children}
                                    <h3>{titleText}</h3>
                                </div>  
                                <div className="card-lower-part d-flex justify-content-center mt-3">
                                    <h1>{quantity}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default Card;