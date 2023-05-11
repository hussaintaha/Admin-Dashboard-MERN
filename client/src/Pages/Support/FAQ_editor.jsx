import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../../css/faq_editor.css"
import getTheToken from "../../middleWare/getTokenFromStorage";
const process = import.meta.env


function FAQ_editor() {
    
    const question = React.useRef()
    const answer = React.useRef()

    const navigate = useNavigate();


    async function getFaqById() {
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/support/faq/${location.pathname.split("/").pop()}`, { headers: { token: verifyObject.token } })
            // setFaqData(data.data)
            if (resp.status == 200) {
                const data = await resp.json()
                console.log("resp  ", data)
                question.current.value = data.data.question,
                    answer.current.value = data.data.answer
                return
            }
            else {
                const data = await resp.json()
                alert(data.message)
                navigate("/support/faq")
                return
            }
        }
        else {
            alert("Not found the verification token")
            return
        }
    }

    async function addFaq() {
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const data = await fetch(`${process.VITE_BASE_URL}/support/faq_question`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: verifyObject.token
                },
                body: JSON.stringify({
                    question: question.current.value,
                    answer: answer.current.value
                })
            })
            const resp = await data.json()
            navigate("/support/faq")
            console.log("add faq   ", resp)
            return
        }
        else {
            alert("Not found the verification token")
        }
    }

    async function updateFaq() {
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(`${process.VITE_BASE_URL}/support/faq/update/${location.pathname.split("/").pop()}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: verifyObject.token
                    },
                    body: JSON.stringify({
                        question: question.current.value,
                        answer: answer.current.value
                    })
                })
            const data = await resp.json()
            console.log("data ", data)
            navigate("/support/faq")
            return
        }
        else {
            alert("Not found the verification token")
        }
    }

    useEffect(() => {
        if (location.pathname.split("/").pop().length == 24) {
            getFaqById()
        }
    }, [])


    return (
        <div className='main_container'>
            <div className='input_box'>
                <div className='singel_input'>
                    <label>Question</label>
                    <textarea className='input_text_box' ref={question} type='text' />
                </div>
                <div className='singel_input'>
                    <label>Answer</label>
                    <textarea className='input_text_box' ref={answer} type='text' />
                </div>
            </div>
            <hr></hr>
            <div className='action_btn'>
                {
                    location.pathname.split("/").pop().length == 24 ?
                        <button className='faq_update_btn' onClick={updateFaq}>Update</button>
                        :
                        <button className='faq_update_btn' onClick={addFaq} >Create</button>
                }
            </div>
        </div>
    )
}

export default FAQ_editor
