import React from 'react'
import Products from './products/Products'
import Batches from './batches/Batches'
import Suppliers from './suppliers/Suppliers'
import Purchases from './purchases/Purchases'


const Dashboard = () => {
  return (
    <div>
      <Products/>
      <Batches/>
      <Suppliers/>
      <Purchases/>
    {/* <ViewProductBatches/> */}
    </div>
  )
}

export default Dashboard