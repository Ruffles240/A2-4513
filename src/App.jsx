import { Dialog } from '@headlessui/react';
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from 'react';
import 'reactjs-popup/dist/index.css';

import '../styles/styles.css';



const supaUrl = "https://igofqolavpbljmdfaoer.supabase.co";

const supaAPI="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnb2Zxb2xhdnBibGptZGZhb2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3NTYxNTYsImV4cCI6MjAyNDMzMjE1Nn0.3MAMTt9Wy0UULKTxyYN1cSPYJ1QGhQfX4L5S3L0-T8w";
const supabase = createClient(supaUrl, supaAPI);

function App() {

  /**
   * These are sample objects for my methods to hold before being filled in supabase data
   */
  const sampleDriver= {
    "driverId": 1,
    "driverRef": "speedster_john",
    "number": 22,
    "code": "SJO",
    "forename": "John",
    "surname": "Speedster",
    "dob": "1988-05-14",
    "nationality": "British",
    "url": "http://www.formula1.com/drivers/john_speedster"
  }
  const sampleCon={
    "constructorId": 10,
    "constructorRef": "speed_dynamics_racing",
    "name": "Speed Dynamics Racing",
    "nationality": "Italian",
    "url": "http://www.speeddynamicsracing.com"
  }

  const sampleCircuit = {
    circuitId: 0,
    circuitRef: 'ACGP2024',
    name: 'blahblah',
    location: 'blahblah',
    country: 'Aurelia',
    lat: 47.123,
    lng: 12.321,
    alt: 15,
    url: 'blablah'
  };


  const [isLogin, setLogin] = useState(true);
  const [raceData, setSeason]=useState([]);
  const [years, setYears] = useState([]);
  const [selectedRace, setRace] = useState(0);
  const [qualifyingData, setQualifyingData] =useState([]);
  const [currentYear, setCurrentYear] = useState(0);
  const [resultsData, setResults] =useState([]);
  const [raceView, setRaceView] = useState(true);
  const [driverStandingsData, setDriverStandingsData]=useState([]);
  const [constructorStandingsData, setConstructorStandingsData]=useState([]);
  const [selectedDriver, selectDriver] =useState(sampleDriver);
  const [selectedConstructor, selectConstructor] =useState(sampleCon);
  const [selectedCircuit, selectCircuit] =useState(sampleCircuit);
  const [isOpen, setIsOpen] = useState(false);
  const [isDriverOpen, setIsDriverOpen] = useState(false);
  const [isConOpen, setIsConOpen] =useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen]=useState(false);
  const [circuitFavorites, setCircuitFavorites]=useState([]);
  const [driverFavorites, setDriverFavorites]=useState([]);
  const [constructorFavorites, setConstructorFavorites]=useState([]);
  const [isMessageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] =useState("");
  const [isCircuitOpen, setIsCircuitOpen]= useState(false);

  const [currentRace, setCurrentRace] =useState([]);

  
  useEffect(() => {
    getYears();
  }, []);

  


  useEffect(()=>{
    getRace();

  }, [selectedRace])

  async function getRace(){
    const{ data } = await supabase.from('races').select('*, circuits(*)').eq('raceId',selectedRace);

    setCurrentRace(data);

  }

  useEffect (()=>{

    getQualifyingData();
  }, [selectedRace]);

  async function getQualifyingData (){
    const{ data } = await supabase.from('qualifying').select('*, drivers (driverId, forename,surname, dob, nationality, url, number), races (round), constructors(constructorId, name, nationality, url)').eq('raceId',selectedRace).order('position');

    setQualifyingData(data);

  }

  useEffect(()=>{


    getDriverStandingsData();
  }, [selectedRace])

  useEffect(()=>{


    getConstructorStandingsData();
  }, [selectedRace])

  async function getDriverStandingsData(){

    const {data} = await supabase.from('driverStandings').select('*, drivers (driverId, forename,surname, dob, nationality, url, number)').eq('raceId',selectedRace).order('position');

    setDriverStandingsData(data);
  }


  async function getConstructorStandingsData(){

    const {data} = await supabase.from('constructorStandings').select('*, constructors(constructorId, name, nationality, url)').eq('raceId',selectedRace).order('position');

    setConstructorStandingsData(data);
  }

  useEffect(() => {
    getRaceData();
  }, [currentYear]);
  async function getRaceData() {
    const { data } = await supabase.from('races').select(('*, circuits(*)')).eq('year', currentYear).order('round');
    setSeason(data);
  };

  async function getYears() {
    const { data } = await supabase.from('seasons').select('year').order('year', {ascending:false});
    setYears(data);
  }

  useEffect(()=>{

    getResultsData();
  }, [selectedRace])


  async function getResultsData(){
    const{ data } = await supabase.from('results').select('*, drivers (driverId, forename,surname, dob, nationality, url, number),races(round, name, date, url, circuits(name)), constructors(constructorId, name, nationality, url)').eq('raceId',selectedRace).order('positionOrder');

    setResults(data);



  }
  
  /**
   * 
   * @returns 
   * This code from https://headlessui.com/react/dialog
   */
  function AboutDialog() {
    return (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 text-white flex items-center justify-center fade-in-up">
        <Dialog.Panel className="w-3/5 h-3/5 bg-gray-500 rounded-md p-6 flex flex-col justify-between">
          <Dialog.Title className="text-center font-bold text-4xl mb-4"><h2>About</h2></Dialog.Title>
          <Dialog.Description>

            This project was made by Raphael Khan. Using Unsplash photos, credits to {<a href='https://unsplash.com/photos/red-and-black-f-1-race-car-on-track-during-daytime-M5s9Ffs1KqU'className='underline'>Clément Delacre</a>}.
    

    popup windows were made with the {<a href='https://headlessui.com/react/dialog' className='underline'>Headless UI library</a>}
          </Dialog.Description>
          <div className="flex justify-center space-x-3 pt-4">
            <button onClick={() => setIsOpen(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Close</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }
  
  /**
   * This popup allows me to bring the favorites menu up.
   */

  function FavoritesDialog() {
    return (
      <Dialog open={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} className="fixed inset-0 z-50 text-white flex items-center justify-center fade-in-up">
        <Dialog.Panel className="w-5/6 h-5/6 bg-gray-500 rounded-md p-6 flex flex-col">
          <Dialog.Title className="text-center font-bold text-4xl mb-4"><h2>Favorites</h2></Dialog.Title>
          <Dialog.Description className="mb-4">
            {/* Your description content here */}
          </Dialog.Description>
          <div className="flex w-full h-full">
            <div className="w-1/3 p-2">
              <table className="m-auto w-full text-center bg-white">

                <Tablehead entry={["Circuits"]} />
                <tbody className='text-black'>
                {
                
                circuitFavorites.map(fave=>
                
                
                <TableMaker entries={[fave]}/>
                )}
                </tbody>
              </table>
            </div>
            <div className="w-1/3 p-2">
              <table className="m-auto w-full text-center bg-white">
                <Tablehead entry={["Constructors"]} />
                <tbody className='text-black'>
                {
                
                constructorFavorites.map(fave=>
                
                
                <TableMaker entries={[fave]}/>
                )}                </tbody>
              </table>
            </div>
            <div className="w-1/3 p-2">
              <table className="m-auto w-full text-center bg-white">
                <Tablehead entry={["Drivers"]} />
                <tbody className='text-black'>
                {
                
                driverFavorites.map(fave=>
                
                
                <TableMaker entries={[fave]}/>
                )}                     </tbody>
              </table>
            </div>
          </div>
          <div className="mt-auto m-auto pt-4">
            <button onClick={() => setIsFavoritesOpen(false)} className="m-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Close</button>
            <button onClick={() =>{setCircuitFavorites([]); setDriverFavorites([]); setConstructorFavorites([]); setMessage("Favourites Cleared"); setMessageOpen(true); setIsFavoritesOpen(false)}} className="m-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Empty Favorites</button>

          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  /**
   * Driver info modal
   */

  function DriverDialog(props) {

    const name = props.driver.forename+" "+ props.driver.surname;

    /**
     * 
     * image of Max Verstappen from https://www.motorsport.com/driver/max-verstappen/17529/
     */
    
    return (
      <Dialog open={isDriverOpen} onClose={() => setIsDriverOpen(false)} className="fixed inset-0 z-50 text-white flex items-center justify-center fade-in-up">
        <Dialog.Panel className="w-3/5 h-3/5 bg-gray-500 rounded-md p-6 flex flex-col justify-between">
          <Dialog.Title className="text-center font-bold text-4xl mb-4"><h2>{name}</h2></Dialog.Title>
          <Dialog.Description className={"m-auto mt-0"}>
            <p>Date of Birth: {props.driver.dob}</p>
            <p>Nationality: {props.driver.nationality}</p>
            <a href={props.driver.url}>{props.driver.url}</a>


          
          </Dialog.Description>

          <img src='/images/Max.jpg' className='h-1/3 w-1/4 m-auto rounded' alt="Max Is Every F1 Driver"></img>
          <div className="flex justify-center space-x-3 pt-4">
            <button onClick={() => setIsDriverOpen(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Close</button>
            <button onClick={() => { if(!driverFavorites.includes(name)) {setDriverFavorites(prevFavorites => [...prevFavorites, name]); setMessage("Added to Favorites"); } else{setMessage("Already In Favorites");}
            setMessageOpen(true); 
            setIsDriverOpen(false);
            
            }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Add Favorite</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  
  /**
   * THis is used for various messages
   */

  function TempDialog(props) {

    useEffect(() => {
      let timeoutId;
      if (isMessageOpen) {
        timeoutId = setTimeout(() => {
          setTempMessageOpen(false);
        }, 1300);
      }});
    
    return (
      <Dialog open={isMessageOpen} onClose={() => setMessageOpen(false)} className="fixed top-20 inset-x-0 z-50 text-white flex items-start justify-center fade-in-up">
        <Dialog.Panel className="w-1/5 h-1/5 bg-gray-500 rounded-md p-6 flex flex-col justify-between">
          <Dialog.Title className="text-center font-bold text-4xl mb-4"><h2>{props.text}</h2></Dialog.Title>
    
        </Dialog.Panel>
      </Dialog>
    );
  }

  /**
   * Makes links for circuits
   */

  const CircuitLink =(props)=>{
    

    return (
      <button 
        onClick={() => {
          selectCircuit(props.circuit);
          setIsCircuitOpen(true);
        }} 
        className='underline hover:scale-105'
      >
        {props.circuit.name.length > 30 ? `${props.circuit.name.substring(0, 30)}...` : props.circuit.name}
      </button>
    );    
    

  }

  /**
   * Gives Circuit info
   * 
   * 
   */


  function CircuitDialog(props){

    return <Dialog open={isCircuitOpen} onClose={() => setIsCircuitOpen(false)} className="fixed inset-0 z-50 text-white flex items-center justify-center fade-in-up">
    <Dialog.Panel className="w-3/5 h-3/5 bg-gray-500 rounded-md p-6 flex flex-col justify-between">
      <Dialog.Title className="text-center font-bold text-4xl mb-4"><h2>{props.circuit.name}</h2></Dialog.Title>
      <Dialog.Description className={"m-auto mt-0"}>
        <p>Nationality: {props.circuit.country}</p>
        <a href={props.circuit.url}>{props.circuit.url}</a>

      
      </Dialog.Description>
      <img src='/images/qatar.webp' className='h-1/3 w-1/4 m-auto rounded' alt="Qatar Is Every F1 Circuit"></img>

      <div className="flex justify-center space-x-3 pt-4">
        <button onClick={() => setIsCircuitOpen(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Close</button>
        <button onClick={() => { if(!circuitFavorites.includes(props.circuit.name)){setCircuitFavorites(prevFavorites => [...prevFavorites, props.circuit.name]); setMessage("Added to Favorites");} else{setMessage("Already In Favorites");}
        setMessageOpen(true);
        setIsCircuitOpen(false);
      }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Add Favorite</button>
      </div>
    </Dialog.Panel>
  </Dialog>
  }

  /**
   * image from https://montrealgrandprix.com/news/top-manufacturers-formula-1-cars/
   * @param {*} props 
   * @returns 
   */

  function ConDialog(props) {

    
    return (
      <Dialog open={isConOpen} onClose={() => setIsConOpen(false)} className="fixed inset-0 z-50 text-white flex items-center justify-center fade-in-up">
        <Dialog.Panel className="w-3/5 h-3/5 bg-gray-500 rounded-md p-6 flex flex-col justify-between">
          <Dialog.Title className="text-center font-bold text-4xl mb-4">{props.constructor.name}</Dialog.Title>
          <Dialog.Description className={"m-auto mt-0"}>
            <p>Nationality: {props.constructor.nationality}</p>
            <a href={props.constructor.url}>{props.constructor.url}</a>

          
          </Dialog.Description>
          <img src='/images/mclaren.jpg' className='h-1/3 w-1/4 m-auto rounded' alt="McLaren Is Every F1 Constructor"></img>

          <div className="flex justify-center space-x-3 pt-4">
            <button onClick={() => setIsConOpen(false)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Close</button>
            <button onClick={() => { if(!constructorFavorites.includes(props.constructor.name)) {setConstructorFavorites(prevFavorites => [...prevFavorites, props.constructor.name]); setMessage("Added to Favorites"); } else{setMessage("Already In Favorites");}
            setMessageOpen(true); 
            setIsConOpen(false);
            
            }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">Add Favorite</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  

 /**
  * Trophy icons from https://www.vectorstock.com/royalty-free-vector/gold-silver-and-bronze-winners-cup-flat-icon-vector-2635677
  * @param {
  * } param0 
  * @returns 
  */

  const PodiumItem = ({ driver, position, imageSrc, driverName }) => {
    return (
      <div className="flex flex-col items-center p-4 border bg-gray-300 border-gray-300 rounded shadow w-1/3">
        <div className="text-m font-semibold text-center h-8 overflow-hidden">
          <span className="block truncate" alt={driverName}>{driver}</span>
        </div>
        <img src={imageSrc} alt={driverName} className="w-24 h-24 mt-2 mb-4 rounded-full object-cover" />
        <div className="text-xl font-bold">{position}</div>
      </div>
    );
  };

const Podium = ({ topDrivers }) => {

  let i =0;
  return (
    <div className="flex justify-center space-x-4 mb-5">
      {topDrivers.map((d) => 
        
        {
          i++;
          return <PodiumItem
          key={i}
          driver={<DriverLink driver={d}/>}
          position={i}
          imageSrc={"/images/"+i+".png"} 
        driverName={d.surname}/>
         
        }
      )}
    </div>
  );
};

  
  const Login = function (props ){

  
  
  return <div className='bg-gray-200 h-1/2 w-1/3 m-auto rounded mt-20'>

    <h2 className='text-black text-3xl text-center mt-5'>Login</h2>

    <div className="p-8 rounded">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            id="email"
            type="email"
            placeholder="Email"/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
            id="password"
            type="password"
            placeholder="********"/>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            type="button" onClick={() =>setLogin(false)}>
            Login
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none"
            type="button">
            Register
          </button>
        </div>
      </div>
  </div>}


const Tablehead = (props)=>{



  return <thead className="bg-gray-800 text-white">{props.entry.map(entry =>
    <th key = {entry} className="text-left py-3 px-4 uppercase font-semibold text-sm">{entry}</th>)}</thead>

    
}

const TableMaker =(props) =>{


  let i=0
  const tableData =props.entries.map(entry =>{ 
    i++; 
    return <td key ={i}className="py-3 px-2">{entry}</td>; })

  return <tr className="border-b" key={props.key}> {tableData}</tr>


}



const RacesTable = () => {


  const races =  
    raceData.map(race => 
      <TableMaker key ={race.id} entries = {[race.round, <CircuitLink circuit ={race.circuits}/>, [<button key = {0} className="bg-gray-500 text-white text-sm px-1 py-1 rounded hover:bg-gray-400 ml-1" onClick={()=>{setRace(race.raceId)
      
      setRaceView(true);}
    }>Results</button>
      ,<button key = {1} className="bg-gray-500 text-white text-sm px-1 py-1 rounded hover:bg-gray-400 ml-1" onClick= {()=>{ 

        setRace(race.raceId);

        setRaceView(false);

      }}>Standings</button>]]}/>);


  return (
    <div className="h-screen">

      <h2 className="text-center text-3xl uppercase font-semibold">{currentYear}{' '}Season</h2>
      <table className="w-full bg-white mt-5 h 2/3 ">
       <Tablehead entry ={["Round", "Circuit", "Actions"]}/>
        <tbody className="text-gray-700 h-2/3 overflow-y-scroll ">
          {races}
        </tbody>
      </table>
    </div>
  );
};

/**
 * The logged in screen
 * @param {*} props 
 * @returns 
 */
const LoggedIn = function (){



  const SelectBar = () =>{
    
    
return <select id="season" value={currentYear} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md" onChange={(event) => {
  setRace(0);
  setCurrentYear(event.target.value) }}>
                <option value="0" disabled>
                  Select an option
                </option>
                {years.map((year) => (
                  <option key={year.year}>{year.year}</option>
                  ))}
              </select>  }

  return (
    <div className="h-9/10 mt-5  m-auto w-6/7">
      <header className="bg-gray-200 py-10 px-6 flex w-5/6 justify-between items-center m-auto rounded h-20">
      <div className="mb-4">
              <label htmlFor="season" className="block text-xl font-medium text-gray-700">Season</label>
              <SelectBar />
       </div>
        <h1 className="text-3xl uppercase font-bold">Dashboard  </h1>
        <nav>
          <ul className="flex space-x-4 text-xl">
            <li className=' bg-gray-500 rounded text-white hover:bg-gray-400'><button className='p-1' disabled={!circuitFavorites.length && !driverFavorites.length &&!constructorFavorites.length} onClick={()=>setIsFavoritesOpen(true)}>Favorites</button></li>
            <li className=' bg-gray-500 rounded text-white hover:bg-gray-400'><button className='p-1' onClick={() =>setIsOpen(true)}>About</button></li>
          </ul>
        </nav>
      </header>
      { currentYear ?
    <div className="flex flex-col md:flex-row h-screen w-6/7 m-auto">
    <aside className="bg-gray-200 mt-4 min-w-[550px] max-w-[550px] m-2 ml-4 h-5/6 rounded">
      <div className="p-4 max-h-full overflow-auto">
        <RacesTable />
      </div>
    </aside>
    
    <section className="bg-gray-200 p-4 mr-6 mt-4 m-2 h-5/6 min-w-[calc(100%-590px)] max-w-[calc(100%-590px)] rounded ">
      {raceView ? (
        <div className="h-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Race Details</h2>
          <div><span><p></p></span></div>
          <RaceDetails />
        </div>
      ) : (
        <div className="h-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Standings</h2>
          <StandingDetails/>
        </div>
      )}
    </section>
  </div>
      :<></>}
    </div>
  );
};

/**
 * 
 * @returns Provides the Standings tables
 */

const StandingDetails = () =>{

  return (
    <div className='h-full'>
      {
        currentRace.length ? (
          <div className='bg-gray-200 rounded-lg shadow-md p-4 m-auto text-center mt-2 mb-2'>
            <span className='font-bold'>After Round:</span> {currentRace[0].round} 
            
          </div>
        ) : <></>
      }
    <div className="flex flex-col md:flex-row h-full">

    
      <div className="w-full w-1/2 p-4 overflow-y-scroll h-4/5">
        <h3 className="text-xl font-semibold mb-3 text-center">Driver Standings</h3>

        <table className="min-w-full text-sm overflow-y-scroll bg-white">
          <Tablehead entry = {["Position",	"Driver",	"Points",	"Wins"]}/>
          <tbody className="h-3/4">

            
          {driverStandingsData.map(driver => (
  <TableMaker 
    key={driver.driverStandingsId} 
    entries={[
      driver.position, 
      <DriverLink driver={driver.drivers}/>, 
      , 
      driver.points, 
      driver.wins
     
    ]}
  />
))}
          </tbody>
        </table>
      </div>

      <div className="w-full w-1/2 p-4 md:border-l overflow-y-scroll h-4/5">
        <h3 className="text-xl text-center font-semibold mb-3">Constructor Standings</h3>
        <table className="min-w-full text-sm overflow-y-scroll  bg-white">
          <Tablehead entry= {["Pos"	,"Constructor"	,"Laps",	"Pts"]}/>
          <tbody className="h-3/4">
            {constructorStandingsData.map(constructor => (

              <TableMaker key={constructor.position} 
              
              entries=
              
              {[
                constructor.position, 
                <ConstructorLink constructor={constructor.constructors}/>, 
                constructor.points, 
                constructor.wins
               
              ]}/>
             
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );



}




const DriverLink =(props)=>{

  return <button onClick={()=>{selectDriver(props.driver);setIsDriverOpen(true)}} className='underline hover:scale-105'>{props.driver.forename+ " "+ props.driver.surname}</button>

}


const RaceDetails = () => {


  return (

    <div className='h-full'>
      {
        currentRace.length ? (
          <div className='bg-gray-200 rounded-lg shadow-md p-2 m-auto text-center  mb-2'>
            <span className='font-bold'>Round:</span> {currentRace[0].round} 
            <span className='font-bold ml-4'>Year:</span> {currentRace[0].year} 
            <span className='font-bold ml-4'>Date:</span> {currentRace[0].date}
            <span className='font-bold ml-4'>Circuit:</span> <CircuitLink circuit={currentRace[0].circuits}/>
            <span className='font-bold ml-4'>Url:</span> <a href={currentRace[0].url}>{currentRace[0].url}</a>


          </div>
        ) : <></>
      }
    <div className="flex flex-col md:flex-row h-full">
      
      <div className="w-full w-1/2 p-4 overflow-y-scroll h-4/5 mt-15">
        <h3 className="text-xl font-semibold mb-3 text-center">Qualifying</h3>
        <table className="min-w-full text-sm overflow-y-scroll bg-white">
          <Tablehead entry = {["Pos",	"Driver",	"",	"Q1",	"Q2",	"Q3"]}/>
          <tbody className="h-3/4">

            
          {qualifyingData.map(driver => (
  <TableMaker 
    key={driver.qualifyId} 
    entries={[
      driver.position, 
      <DriverLink driver={driver.drivers}/>, 
      <ConstructorLink constructor={driver.constructors}/>, 
      driver.q1, 
      driver.q2, 
      driver.q3
    ]}
  />
))}
          </tbody>
        </table>
      </div>

      <div className="w-full w-1/2 p-4 md:border-l overflow-scroll h-4/5 ml-3 mt-15">
        <h3 className="text-xl text-center font-semibold mb-3">Results</h3>

      
        { resultsData.length ? (
        <Podium topDrivers ={[resultsData[0].drivers,resultsData[1].drivers,resultsData[2].drivers]}></Podium>):<></>}


        <table className="min-w-full text-sm  bg-white">
          <Tablehead entry= {["Pos"	,"Driver",	""	,"Laps",	"Pts"]}/>
          <tbody>
            {resultsData.map(result => (

              <TableMaker key={result.position} entries={[result.position,       <DriverLink driver={result.drivers}/>, 
              , <ConstructorLink constructor={result.constructors}/>, result.laps, result.points ]}/>
             
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

const ConstructorLink =(props)=>{

  return <button onClick={async ()=>{ {
    

     await selectConstructor(props.constructor);
    await setIsConOpen(true); 



    
  
    
    
    
    
    
    console.log(props.constructor.id)}}} 
  
  
  className='underline hover:scale-105'>{props.constructor.name}</button>



}





  return (
    <>
    <TempDialog text={message}/>
    
    <ConDialog constructor={selectedConstructor}/>
    <FavoritesDialog/>

    
    <DriverDialog driver ={selectedDriver}/>
    <AboutDialog />
    <CircuitDialog circuit={selectedCircuit}/>
    <h1 className='text-white text-6xl text-center mt-5'>{"F1 For All"}</h1>
      <main className=''>


        {isLogin ? (

        <Login />) : 
        
        (<LoggedIn />)}

      </main>
    
  
  </>)
}







export default App
