'use client'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const ContactInfoSchema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().required(),
  phone: Yup.string().required(),
})
export default function ContactInfoForm() {
  const [name, setName] = useState("")
  useEffect(() => {
    const storedName = window.localStorage.getItem("name")
    if (storedName) {
      setName(storedName)
    }
  }, [])
  useEffect(() => {
    window.localStorage.setItem("name", name)
  }, [name])

  const [email, setEmail] = useState("")
  useEffect(() => {
    const storedEmail = window.localStorage.getItem("email")
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])
  useEffect(() => {
    localStorage?.setItem("email", email)
  }, [name])

  const [phone, setPhone] = useState("")
  useEffect(() => {
    const storedPhone = window.localStorage.getItem("phone")
    if (storedPhone) {
      setPhone(storedPhone)
    }
  }, [])
  useEffect(() => {
    localStorage?.setItem("phone", phone)
  }, [name])

  const initialValues = {
    name,
    email,
    phone,
  }

  return (
    <section>
      {
        name && email && phone ? (
          <div className="flex flex-col gap-2">
            <p><span className="font-semibold">Name:</span> {name}</p>
            <p><span className="font-semibold">Email:</span> {email}</p>
            <p><span className="font-semibold">Phone:</span> {phone}</p>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={ContactInfoSchema}
            onSubmit={(values, { resetForm }) => {
              setName(values.name)
              setEmail(values.email)
              setPhone(values.phone)
              resetForm()
            }}
          >
            <Form className="flex flex-col">
              <label htmlFor="name">Name</label>
              <Field id="name" type="text" name="name" className="border-2" />
              <ErrorMessage name="name" component="div" />

              <label htmlFor="email">Email</label>
              <Field id="email" type="email" name="email" className="border-2" />
              <ErrorMessage name="email" component="div" />

              <label htmlFor="phone">Phone</label>
              <Field id="phone" type="tel" name="phone" className="border-2" />
              <ErrorMessage name="phone" component="div" />

              <button type="submit">Add contact info +</button>
            </Form>
          </Formik>
        )
      }


    </section>
  )
}
