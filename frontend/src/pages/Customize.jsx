import React, { useContext, useRef, useState } from 'react'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import image4 from "../assets/bg2.png"
import Card from '../components/Card'
import { RiUploadCloudLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
    const {serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    const inputImage = useRef();
    const navigate = useNavigate();

    const handleImage = (e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#08086deb] flex justify-center items-center flex-col p-[20px] '>
        <MdKeyboardBackspace className='text-white top-5 absolute left-5 cursor-pointer size-[30px]' onClick={()=>navigate("/")}/>
        <h1 className='text-white text-[30px] text-center mb-[30px] '>Select your <span className='text-blue-600'>Assistant Image</span></h1>
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px] mb-[30px]'>
        <Card image = {image1}/>
        <Card image = {image2}/>
        <Card image = {image3}/>
        <Card image = {image4}/>
        <div className={`w-[150px] h-[250px] bg-blue-800 border-2 rounded-2xl border-blue-950 overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:size-55 cursor-pointer hover:border-white hover:border-4 flex justify-center items-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={()=> {
            inputImage.current.click()
            setSelectedImage("input")
        }}>
            {!frontendImage && <RiUploadCloudLine className=' w-[50px] text-white h-full object-cover rounded-2xl' />}
            {frontendImage && <img src={frontendImage} className='h-full object-cover' /> }
        
        </div>
        <input type="file" accept='image/*' hidden ref={inputImage} onChange={handleImage} />
      </div>

      {selectedImage && <button className='min-w-[150px] h-[60px] rounded-full text-black text-[20px] font-semibold cursor-pointer border-blue-950 bg-blue-950' onClick={()=>navigate("/customize2")}>Next</button>}

    </div>
  )
}

export default Customize
