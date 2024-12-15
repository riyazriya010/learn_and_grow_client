"use client"

import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"
import { useEffect } from "react"

const FetchData = () => {
    useEffect(() => {
        const data = async () => {
            const response = await axios(`${USER_SERVICE_URL}/getUser`)
            const result = await response.data
            console.log('response: ', response)
            console.log('Responsee: ' ,result[1].username)
        }
        data()
    },[])

    return(
        <>
        <h1>Fetch Data</h1>
        </>
    )
}

export default FetchData