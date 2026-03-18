import './Home.css'

import { Bar, Line, Pie  } from "react-chartjs-2";
import { BsFillPencilFill} from 'react-icons/Bs'
import { TbProgressBolt} from 'react-icons/Tb'

import Card from '../../component/Card/Card';
import useChart from '../../hooks/useChart';
import useTickets from '../../hooks/useTickets';
import HomeLayout from '../../Layouts/HomeLayout';



function Home () {

    
    const [ticketsState] = useTickets();
    const [pieChartData, lineChartData, barChartData] = useChart()    
    
    return (
        <>
        <HomeLayout>
           
          
            <div className='d-flex justify-content-center flex-wrap'>
                <Card quantity={ticketsState.ticketDistribution.open} titleText={'Open'}>
                    <BsFillPencilFill />  
                </Card>

                <Card titleText={'In Progress'} quantity={ticketsState.ticketDistribution.inProgress}>
                    <TbProgressBolt />  
                </Card>

                <Card titleText={'Resolved'} quantity={ticketsState.ticketDistribution.resolved}>
                    <TbProgressBolt />  
                </Card>

                <Card titleText={'On Hold'} quantity={ticketsState.ticketDistribution.onHold}>
                    <BsFillPencilFill />  
                </Card>

                <Card titleText={'Canceled'} quantity={ticketsState.ticketDistribution.canceled}>
                    <BsFillPencilFill />  
                </Card>
               
                
            </div>

            

        </HomeLayout>
        <div className='pie-chart-data'>
            <Pie data={pieChartData}/>
        </div>

        <div className="line-chart-data"> 
            <Line 
                data={lineChartData}
            />

        </div>

        <div>
            <Bar 
                data={barChartData}
            />
        </div>
        </>
    )
}

export default Home;