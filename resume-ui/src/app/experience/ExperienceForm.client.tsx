'use client'

import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

type Role = {
  title: string;
  start: string;
  end: string;
  description: string;
}

export type Experience = {
  name: string;
  start: string;
  end: string;
  roles: Role[];
}
const RoleSchema = Yup.object({
  title: Yup.string().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
  description: Yup.string().required(),
})

const ExperienceShema = Yup.object({
  name: Yup.string().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
  roles: Yup.array().of(RoleSchema).optional().default([]),
})

export default function ExperienceForm() {
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    const storedExperiences: Experience[] = JSON.parse(window.localStorage.getItem("experiences") || "[]")
    if (storedExperiences.length > 0) {
      setExperiences(storedExperiences)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("experiences", JSON.stringify(experiences))
  }, [experiences])

  const initialValues: Experience = { name: '', start: '', end: '', roles: [] }

  return (
    <section>
      <Formik
        initialValues={initialValues}
        validationSchema={ExperienceShema}
        onSubmit={(newExperience, { resetForm }) => {
          setExperiences(experiences.concat(newExperience))
          resetForm()
        }}
      >
        <Form className="flex flex-col gap-2">
          <label htmlFor="name">Company name</label>
          <Field id="name" type="text" name="name" className="border-2" autoComplete="true" />
          <ErrorMessage name="name" component="div" />

          <label htmlFor="start">Start date</label>
          <Field id="start" type="date" name="start" className="border-2" />
          <ErrorMessage name="start" component="div" />

          <label htmlFor="end">End date</label>
          <Field id="end" type="date" name="end" className="border-2" />
          <ErrorMessage name="end" component="div" />

          <button type="submit">Add experience +</button>
        </Form>
      </Formik >
      <div className="flex flex-col gap-2">
        {experiences.map((experience) => {
          return (
            <div key={experience.name + experience.start + experience.end} className="flex flex-col p-2 items-start">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-xl">{experience.name}</p>
                <p className="text-sm">{experience.start?.toString()} - {experience.end?.toString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                {
                  experience.roles.map((role) => (
                    <div key={role.title + role.start + role.end}>
                      <p className="font-semibold">{role.title}</p>
                      <p className="text-xs">{role.start?.toString()} - {role.end?.toString()}</p>
                      <p>{role.description}</p>
                    </div>
                  ))
                }
              </div>
              <Formik
                initialValues={{ title: '', start: '', end: '', description: '' }}
                validationSchema={RoleSchema}
                onSubmit={(values, { resetForm }) => {
                  const newExperiences = experiences.map((exp) => {
                    // TODO: this assumes that somebody only ever worked at a place once.
                    // need to handle when names are same, but start and end dates are different
                    if (exp.name === experience.name) {
                      const expWithNewRole = {
                        ...exp,
                        roles: exp.roles.concat({ title: values.title, start: values.start, end: values.end, description: values.description })
                      }
                      return expWithNewRole
                    } else {
                      return exp
                    }
                  })
                  setExperiences(newExperiences)
                  resetForm()
                }}
              >
                <Form className="flex flex-row gap-2 p-4">
                  <label htmlFor="title">Title</label>
                  <Field id="title" type="text" name="title" className="border-2" autoComplete="true" />
                  <ErrorMessage name="title" component="div" />

                  <label htmlFor="start">Start date</label>
                  <Field id="start" type="date" name="start" className="border-2" />
                  <ErrorMessage name="start" component="div" />

                  <label htmlFor="end">End date</label>
                  <Field id="end" type="date" name="end" className="border-2" />
                  <ErrorMessage name="end" component="div" />

                  <label htmlFor="description">Description</label>
                  <Field id="description" type="text" name="description" className="border-2" as="textarea" />
                  <ErrorMessage name="description" component="div" />

                  <button type="submit" className="rounded-md bg-gray-200 p-2">Add role</button>
                </Form>
              </Formik>
            </div>
          )
        })}
      </div>
    </section>
  )
}
