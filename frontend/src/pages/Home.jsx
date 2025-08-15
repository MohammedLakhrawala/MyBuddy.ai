import React, { useEffect, useState, useRef } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import aiImage from '../assets/siri.gif'
import userImage from '../assets/Voice.gif'
import { set } from 'mongoose';

function Home() {
    const navigate = useNavigate();
    const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
    const [listening, setListening] = useState(false);
    const isSpeakingRef = useRef(false);
    const recognitioonRef = useRef(null);
    const isRecognizingRef = useRef(false);
    const synth = window.speechSynthesis
    const [userText, setUserText] = useState("")
    const [aiText, setAiText] = useState("")


    const handleLogOut = async ()=> {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials: true})
             setUserData(null)
            navigate("/signup")
        } catch (error) {
            setUserData(null)
            console.log(error)
        }
    }

    const startRecognition = () =>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try {
            recognitioonRef.current?.start();
            console.log("Recognition requested to start")
        } catch (error) {
          if(!error.message.includes("start")){
            console.log("Recognition start error:", error);
          }
        }
      }
    };

    const speak = (text)=>{
      const utterence = new SpeechSynthesisUtterance(text)
      isSpeakingRef.current=true;
      utterence.onend=()=>{
        setAiText("")
        isSpeakingRef.current=false
        setTimeout(()=>{
          startRecognition()
        },800)
      }
      synth.cancel();
      synth.speak(utterence)
    }

    const handleCommand = (data)=>{
      const {type, userInput, response} = data
        speak(response)

        if(type==='google_search'){
          const query = encodeURIComponent(userInput);
          window.open(`https://www.google.com/search?q=${query}`, '_blank')
        }
        if(type==='calculator_open'){
          window.open(`https://www.google.com/search?q=calculator`, '_blank')
        }
        if(type==='instagram_open'){
          window.open(`https://www.instagram.com/`, '_blank')
        }
        if(type==='facebook_open'){
          window.open(`https://www.facebook.com/`, '_blank')
        }
        if(type==='weather_show'){
          window.open(`https://www.google.com/search?q=weather`, '_blank')
        }
        if(type==='youtube_search' || type==='youtube_play'){
          const query = encodeURIComponent(userInput);
          window.open(`https://www.youtube.com/results?search?search_query=${query}`, '_blank')
        }
    }

    useEffect(()=> {
        const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;

        const recognition = new speechRecognition();
        recognition.continuous=true;
        recognition.lang="en-US";

        recognitioonRef.current = recognition

        let isMounted = true;

        const startTimeout = setTimeout(()=>{
          if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
            try {
              recognition.start();
              console.log("recognition requested to start")
            } catch (e) {
              if(e.name!=="InvalidStateError"){
                console.log("Recognition start error:", e);
              }
            }
          }
        }, 1000)

        const safeRecognition =()=>{
          if(!isSpeakingRef.current && !isRecognizingRef.current){
            try {
              recognition.start();
              console.log("Recognition requested to start")
            } catch (error) {
              if(error.name!=="InvalidStateError"){
                console.log("Start error:", err);
              }
              
            }
          }
        }

        recognition.onstart=()=>{
          console.log("Recognition started");
          isRecognizingRef.current=true;
          setListening(true);
        };

        recognition.onend = () =>{
          console.log("Recognition ended");
          isRecognizingRef.current = false;
          setListening(false);

          if(isMounted && !isSpeakingRef.current){
            setTimeout(()=>{
              if(isMounted){
                try {
                  recognition.start();
                  console.log("Recognition requested to start");
                } catch (error) {
                  if(error.name!=="InvalidStateError"){
                    console.log("Recognition start error:", error);
                  }
                }
              }
            }, 1000)
          }
        };

        recognition.onerror = (event)=>{
          console.warn("Rcognition error:", event.error)
          isRecognizingRef.current=false;
          setListening(false);
          if(event.error!=="aborded" && isMounted && !isSpeakingRef.current){
            setTimeout(()=>{
              if(isMounted){
              try {
                recognition.start();
                console.log("Recognition requested to start");
              } catch (error) {
                if(error.name!=="InvalidStateError"){
                  console.log("Recognition start error:", error);
                }
              }
            }
            }, 1000)
          }
        };

        recognition.onresult =async (e)=>{
            const transcript = e.results[e.results.length-1][0].transcript.trim();
            console.log(transcript)
            if(transcript.toLowerCase().includes            (userData.assistantName.toLowerCase())){
              setAiText("")
              setUserText(transcript);
              recognition.stop()
              isRecognizingRef.current=false
              setListening(false)
                const data = await getGeminiResponse(transcript)
                console.log(data)
                handleCommand(data);
                setAiText(data.response);
                setUserText("")
            }
        }
        recognition.start();

        const fallback = setInterval(()=>{
          if(!isSpeakingRef.current && !isRecognizingRef.current){
            safeRecognition()
          }

        },10000)
        safeRecognition()

          const greetings = new SpeechSynthesisUtterance(`hello my master ${userData?.name}. how can i help you today`);
          window.speechSynthesis.speak(greetings);

        return ()=>{
          isMounted = false;
          recognition.stop();
          setListening(false)
          isRecognizingRef.current=false;
          clearInterval(fallback)

        }

    },[])


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010146eb] flex justify-center items-center flex-col'>
            <button className='min-w-[150px] h-[40px] bg-white rounded-full items-center flex  top-[80px] right-[20px] text-black text-[18px] absolute font-semibold px-[20px] py-[20px] cursor-pointer' onClick={()=>
            navigate("/customize")
            }>Customize ur ass</button>
            <button className='min-w-[150px] h-[40px] items-center justify-center flex bg-white px-[20px] py-[20px] rounded-full top-[20px] right-[20px] text-black text-[18px] absolute font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</button>
      <div className='w-[200px] h-[250px] flex justify-center items-center overflow-hidden shadow-2xl mb-[15px]'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover rounded-2xl'/>
      </div>
      <h1 className='text-white text-[30px] font-semibold text-center'>I'm <span className='text-blue-600'>{userData?.assistantName}</span></h1>

      {aiText && <img src={userImage} alt="" className='w-[200px]' /> }
      {!aiText && <img src={aiImage} alt="" className='w-[200px]' /> }

      <h1 className='p-[30px] font-semibold text-2xl text-white '>{userText?userText:aiText?aiText:""}</h1>

    </div>
  )
}

export default Home
