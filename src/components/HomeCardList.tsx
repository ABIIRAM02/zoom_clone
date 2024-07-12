"use client";

import Image from "next/image";
import HomeCard from "@/components/HomeCard";
import { homeCardLinks } from "@/constants/homeCardLinks";
import MeetingModel from "./MeetingModel";
import { useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker'
import { Input } from "./ui/input";

const HomeCardList = () => {
  const [meetingState, setMeetingState] = useState<String | undefined>("");
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const client = useStreamVideoClient();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select Date and TIme",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) router.push(`/meeting/${call.id}`);

      toast({ title: "Meeting Created" });
    } catch (error) {
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="previous">
      {homeCardLinks.map((data, index) => (
        <HomeCard
          key={index}
          imgUrl={data.imgUrl}
          bgColor={data.bgColor}
          title={data.title}
          description={data.description}
          handleClick={() => {
            if(data.title === 'View Recordings'){
              router.push('/recordings')
              return
            }
            setMeetingState(data.meetingState);
          }}
        />
      ))}

      {!callDetails ? (
        <MeetingModel
          isOpen={meetingState === "scheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
          }}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5 my-[1rem]" >
            <label className="text-base text-normal leading-[22px] text-sky-2" >Add a description</label>
            <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" 
            onChange={(e)=>{setValues({...values , description:e.target.value})}}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 my-[1rem]" >
            <label className="text-base text-normal leading-[22px] text-sky-2" >Select Date and Time</label>
            <ReactDatePicker 
            selected={values.dateTime} 
            onChange={(date)=>setValues({...values , dateTime:date!})}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat='MMMM d, yyyy h:mm aa'
            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModel>
      ) : (
        <MeetingModel
          isOpen={meetingState === "scheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
          }}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={()=>{
            navigator.clipboard.writeText(meetingLink)
            toast({title:'Link Copied'})
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        >

        </MeetingModel>
      )}

      <MeetingModel
        isOpen={meetingState === "newMeeting"}
        onClose={() => {
          setMeetingState(undefined);
        }}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModel
        isOpen={meetingState === "joinMeeting"}
        onClose={() => {
          setMeetingState(undefined);
        }}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => {router.push(values.link)}}
      >
        <Input placeholder="Meeting Link" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" 
        onChange={(e)=>setValues({...values , link:e.target.value})}
        />
      </MeetingModel>
    </section>
  );
};

export default HomeCardList;
