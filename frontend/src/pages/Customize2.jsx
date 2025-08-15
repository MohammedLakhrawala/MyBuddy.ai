import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
    const {serverUrl, userData, backendImage, selectedImage, setUserData} = useContext(userDataContext)
    const [assistantName, setassistantName] = useState(userData?.name || "");
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);

    const handleUpdateAssistant = async ()=>{
        setLoading(true);
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if(backendImage){
                formData.append("assistantImage", backendImage)
            }else{
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials: true})
            setLoading(false);
            console.log(result.data)
            setUserData(result.data)
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#08086deb] flex justify-center items-center flex-col p-[20px] '>
        <MdKeyboardBackspace className='text-white top-5 absolute left-5 cursor-pointer size-[30px]' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white text-[30px] text-center mb-[30px] '>Enter your <span className='text-blue-600'>Assistant Name</span></h1>

      <input type="text" id='name'  placeholder='Enter your Name' className=' w-full max-w-[500px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-[30px]' onChange={(e)=>setassistantName(e.target.value)} value={assistantName} required/>

      {assistantName && <button className='min-w-[150px] h-[60px] rounded-full text-black text-[20px] font-semibold cursor-pointer border-blue-950 bg-blue-950' disabled={loading} onClick={()=>{
        navigate("/")
        handleUpdateAssistant()
      }}>{!loading ? "Create" : "Creating..."}</button>}

    </div>
  )
}

export default Customize2
