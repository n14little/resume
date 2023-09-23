'use client'
import { useState, FormEvent } from 'react'

enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
}

type Role = {
  title: string;
  start?: string;
  end?: string;
  description: string;
}

type Experience = {
  name: string;
  start?: string;
  end?: string;
  roles: Role[];
}

export default function ResumeBuilder() {
  const [jobDescription, setJobDescription] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [experienceName, setExperienceName] = useState<Experience["name"]>("")
  const [experienceStart, setExperienceStart] = useState<Experience["start"]>("")
  const [experienceEnd, setExperienceEnd] = useState<Experience["end"]>("")

  function addSkill(skill: string) {
    if (!skills.includes(skill)) {
      setSkills((curSkills) => curSkills.concat(skill))
    }

    setNewSkill("")
  }

  function addExperience() {
    const experience = {
      name: experienceName,
      start: experienceStart,
      end: experienceEnd,
      roles: [],
    }
    setExperiences((curExperiences) => curExperiences.concat(experience))
    setExperienceName("")
    setExperienceStart("")
    setExperienceEnd("")
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const resumeForJd = {
      jobDescription,
      contact: {
        name,
        email,
        phone,
      },
      skills,
      experiences,
    }
    console.log(JSON.stringify(resumeForJd, null, 2))
  }

  return (
    <form className="flex flex-col w-full" onSubmit={onSubmit}>

      <label htmlFor="jobDescription">Job description</label>
      <textarea id="jobDescription" onChange={(e) => { setJobDescription(e.target.value) }} />

      <fieldset className="flex flex-col border-gray-200 border-2">

        <legend>Contact information</legend>

        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => { setName(e.target.value) }} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />

        <label htmlFor="phone">Phone number</label>
        <input id="phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value) }} />

      </fieldset>

      <fieldset className="flex flex-col border-gray-200 border-2">

        <legend>Skills</legend>

        {skills.map((skill) => {
          return <span key={skill}>{skill}</span>
        })}

        <label htmlFor="newSkill">New skill</label>
        <input id="newSkill" type="text" value={newSkill} onChange={(e) => { setNewSkill(e.target.value) }} />

        <button type="button" onClick={() => { addSkill(newSkill) }}>Add skill +</button>

      </fieldset>


      <fieldset className="flex flex-col border-gray-200 border-2">

        <legend>Experience</legend>

        {experiences.map((experience) => {
          return (
            <div key={experience.name + experience.start + experience.end}>
              <span>{experience.name}</span>
              <span>{experience.start?.toString()} - {experience.end?.toString()}</span>
            </div>
          )
        })}

        <label htmlFor="newExperience">Company name</label>
        <input id="newExperience" type="text" value={experienceName} onChange={(e) => { setExperienceName(e.target.value) }} />

        <label htmlFor="startDate">Start date</label>
        <input id="startDate" type="date" value={experienceStart} onChange={(e) => { setExperienceStart(e.target.value) }} />

        <label htmlFor="endDate">End date</label>
        <input id="endDate" type="date" value={experienceEnd} onChange={(e) => { setExperienceEnd(e.target.value) }} />

        <button type="button" onClick={() => { addExperience() }}>Add experience +</button>

      </fieldset>

      <button type="submit">Submit</button>

    </form>
  )
}
