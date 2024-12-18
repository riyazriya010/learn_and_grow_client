"use client"

import { MENTOR_SERVICE_URL } from "@/utils/constant"
import axios from "axios"

const Sample = () => {
    const data = {username: 'Riyas', password: '123124'}
    const handle = async (data: any) => {
        const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/sample`,data, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        console.log('responseeeeee: ', response)
    }

    return (
        <>
        <button onClick={() => handle(data)}>Click to authenticate</button>
        </>
    )
}

export default Sample