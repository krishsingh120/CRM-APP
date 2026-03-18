import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { filterTickets, getAllTicketsforTheUser } from '../Redux/Slices/TicketSlice';



function useTickets () {
    const authState = useSelector((state) => state.auth);
    const ticketsState = useSelector((state) => state.tickets)
    const [searchParams] = useSearchParams()
    

    const dispatch = useDispatch();
    

    async function loadTickets () {
        await dispatch(getAllTicketsforTheUser());
        if(searchParams.get('status')){
            dispatch(filterTickets({status: searchParams.get('status')}))
        }
    }
    

    useEffect(() => {

        loadTickets()

    }, [authState.token])

    return [ticketsState];
}

export default useTickets;