// @ts-nocheck
"use client";

import { useGetCalls } from "@/Hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "upcoming" | "ended" | "recording" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const [recording, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast()

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recording":
        return recording;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recording":
        return "No Recording";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(()=>{

    const fetchRecordings = async () => {
       try {
        const callData = await Promise.all(
            callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
          );
        const myRecordings = callData
        .filter(call => call.recordings.length > 0)
        .flatMap(call => call.recordings)

        setRecordings(myRecordings);
       } catch (error) {
        toast({title : 'Try again later'})
       }
    }

    if(type === 'recording') fetchRecordings()
  } ,[type , callRecordings])

  const calls = getCalls();
  const noCallsMsg = getNoCallsMessage();

  

  if(isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => <MeetingCard
        key={(meeting as Call).id}
        icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
          }
        title={meeting.state?.custom?.description?.substring(0,26) || meeting?.filename?.substring(0,20) || 'Personal Meeting'}
        date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}

        isPreviousMeeting={type === 'ended'}
        buttonIcon1={type === 'recording' ? '/icons/play.svg' : undefined}
        buttonText={type === 'recording' ? 'Play' : 'Start'}
        link={type === 'recording' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
        handleClick={type === 'recording' ? ()=> router.push(`${meeting.url}`): ()=> router.push(`/meeting/${meeting.id}` )}
        />)
      ) : (
        <h1>{noCallsMsg}</h1>
      )}
    </div>
  );
};

export default CallList;
