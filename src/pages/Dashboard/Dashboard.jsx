

import { usePDF } from 'react-to-pdf';

import useTickets from "../../hooks/useTickets";
import HomeLayout from "../../Layouts/HomeLayout";


function Dashboard () {
    
    const [ticketState] = useTickets()
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

    
    return (
        <>  
            <HomeLayout></HomeLayout>


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
                                <th scope="col">Title</th>
                                <th scope="col">Descriptions</th>
                                <th scope="col">Reporter</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Asignee</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        {ticketState && ticketState.ticketList.map((ticket) => {
                            return (
                                <tbody key={ticket._id}>
                                    <tr>
                                    <td scope="row">{ticket._id}</td>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.assignee}</td>
                                    <td>{ticket.ticketPriority}</td>
                                    <td>{ticket.assignedTo}</td>
                                    <td>{ticket.status}</td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
        </>
    )
}

export default Dashboard;