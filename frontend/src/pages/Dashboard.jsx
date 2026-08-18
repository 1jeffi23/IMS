import React from 'react'
import Products from './products/Products'
import Batches from './batches/Batches'
import Suppliers from './suppliers/Suppliers'


const Dashboard = () => {
  return (
    <div>
      <Products/>
      <Batches/>
      <Suppliers/>
    {/* <ViewProductBatches/> */}
    </div>
  )
}

export default Dashboard