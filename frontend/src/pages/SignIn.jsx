import { useContext, useState } from 'react'
import bg from "../assets/authbg.png"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { userDataContext } from '../context/UserContext.jsx';

const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const {serverUrl,userData, setUserData} = useContext(userDataContext)
  const [err, setErr] = useState("")

  const handlesubmit = async (e)=> {
    e.preventDefault()
    setErr("")
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email, password
      }, {withCredentials: true})
      setUserData(result.data)
      setLoading(false);
      navigate("/")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setErr(error.response.data.message)
      setLoading(false);
    }
  }
  return (
    <div className='h-[100vh] w-full bg-cover flex justify-center items-center' style={{backgroundImage: `url(${bg})`}}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#0000009d] backdrop:blur shadow-lg shadow-black-950 flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handlesubmit}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Login to <span className='text-blue-400'>Virtual Assistant</span> </h1>

        <input type="Email" id='email' placeholder='Enter your Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'required onChange={(e)=> setEmail(e.target.value)} value={email}/>

        <div className='w-full h-[60px] border-2 bg-transparent text-white text-[18px] rounded-full border-white relative'>
            <input type={showPass ? "text" : "password"} id='pass' placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'required onChange={(e)=> setPassword(e.target.value)} value={password}/>
            {
              !showPass && <IoIosEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPass(true)}/>
            }
            {
              showPass && <IoIosEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPass(false)}/>
            }
        </div>
       {err?.length>0 && <p className='text-red-500'>{err}</p>}
            <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black text-[20px] font-semibold cursor-pointer' disabled={loading}>{loading? "Loading.." : "Log in"}</button>

            <p className='text-white ' >Don't have an account?  <span className='font-semibold text-blue-400 cursor-pointer' onClick={()=> {navigate("/signup")}}>Sign Up</span></p>
      </form>
    </div>
  )
}

export default SignIn
