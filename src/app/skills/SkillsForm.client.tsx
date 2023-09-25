'use client'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const SkillsSchema = Yup.object({
  skill: Yup.string().required(),
})
export default function SkillsForm() {
  const [skills, setSkills] = useState<string[]>([])
  useEffect(() => {
    const storedSkills = JSON.parse(window.localStorage.getItem("skills") || "[]") || []
    if (storedSkills.length > 0) {
      setSkills(storedSkills)
    }
  }, [])
  useEffect(() => {
    window.localStorage.setItem("skills", JSON.stringify(skills))
  }, [skills])

  const initialValues = {
    skill: '',
  }

  return (
    <section className="flex flex-col gap-4">

      <div className="flex flex-row flex-wrap gap-2">
        {
          skills.map((skill) => (
            <span className="bg-gray-200 rounded-full p-2" key={skill}>{skill}</span>
          ))
        }
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={SkillsSchema}
        onSubmit={(values, { resetForm }) => {
          // could use a set here, but not sure the additional code that would be needed elsewhere
          // is necessary. How many skills will one person honestly put on their resume?
          if (!skills.includes(values.skill)) {
            setSkills(skills.concat(values.skill))
          }
          resetForm()
        }}
      >
        <Form className="flex flex-col">
          <label htmlFor="skill">New skill</label>
          <Field id="skill" type="text" name="skill" className="border-2" />
          <ErrorMessage name="skill" component="div" />

          <button type="submit">Skill +</button>
        </Form>

      </Formik>
    </section>
  )
}
