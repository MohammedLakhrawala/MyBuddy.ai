import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({image}) {
    const {serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[150px] h-[250px] bg-blue-800 border-2 rounded-2xl border-blue-950 overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:size-55 cursor-pointer hover:border-white hover:border-4 ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={()=>
        {
            setSelectedImage(image)
            setBackendImage(null)
            setFrontendImage(null)
        }
    }>
      <img src={image} className=' h-full object-cover rounded-2xl' />
    </div>
  )
}

export default Card
