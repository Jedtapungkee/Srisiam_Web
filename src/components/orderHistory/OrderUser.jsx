import { listUserOrders } from '../../api/User';
import useSrisiamStore from '../../store/Srisiam-store';
import React, { useEffect, useState } from 'react'

const orderUser = () => {
    const token = useSrisiamStore((state) => state.token);
    const [order,setOrder] = useState([]);

    useEffect(()=>{
        fetchUserOrders();
    },[])

    const fetchUserOrders = async()=>{
        const res = await listUserOrders(token);
        setOrder(res.data.orders)
    }
    console.log(order)
  return (
    <div>orderUser</div>
  )
}

export default orderUser