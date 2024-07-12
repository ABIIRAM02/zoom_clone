'use client'

import { useGetCallById } from '@/Hooks/useGetCallById'
import Loader from '@/components/Loader'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

const Meeting = ({params : {id}} : {params : { id : string} }) => {

  const {isLoaded , user} = useUser()
  const [isSetUpComplete , setIsSetUpComplete] = useState(false)
  const {call , isCallLoading} = useGetCallById(id)

  if(!isLoaded || isCallLoading) return <Loader />

  return (
    <main>
      <StreamCall call={call} >
        <StreamTheme>
          {
            !isSetUpComplete ? <MeetingSetup setIsSetUpComplete={setIsSetUpComplete} /> : <MeetingRoom />
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting