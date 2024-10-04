import React from 'react'
import AnalyticsPageComponent from './components/AnalyticsPageComponent'
import axios from 'axios'
import socketIOClient from "socket.io-client"

const AdminAnalyticsPage = () => {
    const fetchOrdersForFirstDate = async (firstDateToCompare) => {
        const { data } = await axios.get("/api/orders/analysis/" + firstDateToCompare)
        return data
    }


    const fetchOrdersForSecondDate = async (secondDateToComapre) => {
        const { data } = await axios.get("/api/orders/analysis/" + secondDateToComapre);
        return data
    }

    return (
        <AnalyticsPageComponent fetchOrdersForFirstDate={fetchOrdersForFirstDate} fetchOrdersForSecondDate={fetchOrdersForSecondDate} socketIOClient={socketIOClient} />
    )
}

export default AdminAnalyticsPage