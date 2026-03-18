import { useEffect, useState } from 'react';
import { usePDF } from 'react-to-pdf';

import axiosInstance from '../../config/axiosInstance';
import HomeLayout from '../../Layouts/HomeLayout'


function ListAllUsers () {

    const [allUserList, setAllUserList] = useState([])
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});


    async function loadAllUsers () {
        const response = await axiosInstance.get('/users', {
            headers: {
                'x-access-token' : localStorage.getItem('token'),
            }
        })

        console.log("all user list", response)
        setAllUserList(response?.data?.result)
    }

    useEffect(() => {

        loadAllUsers()
    }, [])
    return (
        <>
            <HomeLayout />
            <div className="container">
                    <div className="row d-flex justify-content-center py-3">
                        <div className="col-6 py-3"><h2 className='text-end'>All Tickets Record</h2></div>
                        <div className="col-3 py-3"><button className='btn btn-primary mt-1' onClick={() => toPDF()}>Export to Pdf</button></div>
                    </div>
                </div>
            
                <div  ref={targetRef}>
                    <table className="table table-hover table-bordered text-center">
                        <thead className="table-danger">
                            <tr>
                                <th scope="col">Ticket Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Status</th>
                                <th scope="col">Type</th>
                            </tr>
                        </thead>
                        {allUserList && allUserList.map((ticket) => {
                            return (
                                <tbody key={ticket._id}>
                                    <tr>
                                    <td scope="row">{ticket._id}</td>
                                    <td>{ticket.name}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.userStatus}</td>
                                    <td>{ticket.userType}</td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
        </>
    )
}

export default ListAllUsers;