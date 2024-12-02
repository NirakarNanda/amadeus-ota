import FlightsPage from '@/components/FlightCard/FlightsPage'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <FlightsPage/>
    </Suspense>
  )
}

export default page