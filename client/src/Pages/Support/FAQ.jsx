import "../../css/faq.css"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import getTheToken from "../../middleWare/getTokenFromStorage";
const process =  import.meta.env

function FAQ() {

    const navigate = useNavigate();

    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [faqArray, setFaqArray] = useState([])

    async function GetAllreadyAvailabelFAQ() {
        setLoading(true)
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const resp = await fetch(
                // "${process.VITE_BASE_URL}/support/faq_list"
                `${process.VITE_BASE_URL}/support/faq_list`, {
                headers: {
                    token: verifyObject.token
                }
            })
            const data = await resp.json();
            console.log("resp data  ", data)
            setFaqArray(data.data)
            setLoading(false)
            return
        }
        alert("No Token Found ")
    }

    async function addFaq() {
        console.log("add faq")
        navigate("/support/faq_editor/create")
    }


    async function EditFAQ(id) {
        navigate(`/support/faq_editor/${id}`)
        console.log(id)
    }

    async function deleteFAQ(e, id) {
        const verifyObject = getTheToken()
        if (verifyObject.available) {
            const data = await fetch(`${process.VITE_BASE_URL}/support/faq/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token:verifyObject.token
                }
            })
            if(data.status == 200){
                const resp = await data.json()
                console.log(resp.message)
                GetAllreadyAvailabelFAQ()
            }else{
                const resp = await data.json()
                alert(resp.message)
            }
            return
        }
        else{
            alert("No token available")
        }
    }

    useEffect(() => {
        GetAllreadyAvailabelFAQ()
    }, [])

    return (
        <div className='faq_container'>
            {loading ? <h1>Loading....</h1>
                :
                <div className='faq_tabel'>
                    <div className='faq_action_btn_container'>
                        <button className='add_faq faq_action_btn' onClick={addFaq}>Add FAQ</button>

                    </div>
                    <table style={{ width: "100%", textAlign: "center" }}>
                        <thead >
                            <tr className='tabel_head_ul'>
                                <th>S.N</th>
                                <th colSpan="2" className='tabel_head_heading'>Question</th>
                                <th colSpan="2" className='tabel_head_heading'>Answer</th>
                                <th className='tabel_head_heading'>Action</th>
                            </tr>
                        </thead>
                        {faqArray?.length <= 0 ?
                            <tbody>
                                <tr className='noDataFound'>
                                    <td colSpan="4"> No Data To Show</td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {faqArray?.map((element, index) => {
                                    console.log("", element?.answer)

                                    const questionTD = document.createElement("td")
                                    questionTD.innerHTML = (element?.answer).replace("\n", "<br>")

                                    console.log(questionTD)

                                    const tempTR = document.createElement("tr")

                                    console.log("tempTR ", tempTR)
                                    tempTR.appendChild(questionTD)
                                    return (
                                        <tr key={index} className='faq_container'>
                                            <td data-label="S.N" >{((pageCount - 1) * 10) + index + 1}</td>
                                            <td data-label="Question" className='text_start' dangerouslySetInnerHTML={{ __html: (element?.question).replaceAll("\n", "<br>") }} colSpan="2" />
                                            <td data-label="Answer" className='text_start' dangerouslySetInnerHTML={{ __html: (element?.answer).replaceAll("\n", "<br>") }} colSpan="2" />
                                            <td data-label="Action" key={element._id} >
                                                <button className='faq_action_btn' onClick={(e) => { EditFAQ(element._id) }}>Edit</button>
                                                <button className='faq_action_btn' onClick={(e) => { deleteFAQ(e, element._id) }}>Delete</button>
                                            </td>
                                            {/* {questionTD} */}
                                        </tr>
                                        // <tr>{questionTD}</tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                </div>
            }
        </div>
    )
}

export default FAQ
