import react,{useEffect} from "react";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import AxiosRequest from "./AxiosRequest";


const Home = ()=>{
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

const check=async()=>{
    const response = await AxiosRequest.get('/user/check',{
       headers:{
           authorization: token,
       }
    })
    console.log('UserData in Response',response.data.userData);
   }

    useEffect(()=>{
     if(!token){
     navigate('/login');
     }
    check();
    },[token])

return(
    <>
    <Sidebar/>
<h1>Home</h1>
</>
)
}

export default Home;