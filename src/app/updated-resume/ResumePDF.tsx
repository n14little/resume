'use client'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Experience } from "../experience/ExperienceForm.client";
import { useEffect, useMemo, useState } from "react";

function getStyles(windowObj: typeof window) {
  return StyleSheet.create({
    page: {
      backgroundColor: 'white',
      fontFamily: 'Courier'
    },
    details: {
      fontSize: '10px',
    },
    date: {
      fontSize: '8px',
      color: 'gray',
      marginBottom: 5,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    sectionTitle: {
      marginTop: 5,
    },
    subsection: {
      margin: 5,
      padding: 5,
    },
    skills: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skill: {
      padding: '4px',
      fontSize: '10px',
    },
    keySkill: {
      fontFamily: 'Courier-Bold',
      fontWeight: 'bold',
    },
    experienceName: {
      fontSize: '12px',
      fontFamily: 'Courier-Bold',
      fontWeight: 'bold',
    },
    title: {
      fontSize: '11px',
      fontFamily: 'Courier-Bold',
      fontWeight: 'bold',
    },
    underline: {
      borderBottom: '2px',
      borderBottomColor: 'black',
    },
    viewer: {
      width: windowObj.innerWidth, //the pdf viewer will take up all of the width and height
      height: windowObj.innerHeight,
    },
  });
}

type Props = {
  keywords: Set<string>;
  skills: string[];
  experiences: Experience[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  }
}
function ResumePDFView({ keywords, skills, experiences, contactInfo }: Props) {
  const [windowObj, setWindowObj] = useState<typeof window>()
  useEffect(() => {
    setWindowObj(window)
  }, [])
  const styles = useMemo(() => windowObj ? getStyles(windowObj) : undefined, [windowObj])
  if (!styles) {
    return <div></div>
  } else {
    return (
      <PDFViewer style={styles.viewer}>
        {/* Start of the document*/}
        <Document>
          {/*render a single page*/}
          <Page size="A4" style={styles.page}>

            <View style={styles.section}>
              <Text style={styles.details}>{contactInfo.name}</Text>
              <Text style={styles.details}>{contactInfo.email}</Text>
              <Text style={styles.details}>{contactInfo.phone}</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.underline, styles.sectionTitle]}>Skills</Text>
              <View style={styles.skills}>
                {
                  skills.map((skill) => {
                    if (keywords.has(skill)) {
                      return <Text key={skill} style={[styles.skill, styles.keySkill]}>{skill}</Text>
                    } else {
                      return <Text key={skill} style={styles.skill}>{skill}</Text>
                    }
                  })
                }
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.underline, styles.sectionTitle]}>Experience</Text>
              {
                experiences.map((exp) => {
                  return (
                    <View key={exp.name + exp.start + exp.end}>
                      <Text style={styles.experienceName}>{exp.name}</Text>
                      <Text style={styles.date}>{`${new Date(exp.start).toLocaleDateString('en-us', { month: 'short', year: 'numeric' })} - ${new Date(exp.end).toLocaleDateString('en-us', { month: 'short', year: 'numeric' })}`}</Text>

                      {
                        exp.roles.map((role) => {
                          return (
                            <View key={role.title + role.start + role.end} style={styles.subsection}>
                              <Text style={styles.title}>{role.title}</Text>
                              <Text style={styles.date}>{`${new Date(role.start).toLocaleDateString('en-us', { month: 'short', year: 'numeric' })} - ${new Date(role.end).toLocaleDateString('en-us', { month: 'short', year: 'numeric' })}`}</Text>
                              <Text style={styles.details}>{role.description}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
            </View>


            <View style={styles.section}>
              <Text style={[styles.underline, styles.sectionTitle]}>Experience</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.underline, styles.sectionTitle]}>Awards</Text>
            </View>

          </Page>
        </Document>
      </PDFViewer>
    );
  }
}

export default function ResumePDF({ keywords }: Pick<Props, 'keywords'>) {
  const [skills, setSkills] = useState([])
  useEffect(() => {
    const storedSkills = JSON.parse(window.localStorage.getItem("skills") || "[]")
    setSkills(storedSkills || [])
  }, [])

  const [experiences, setExperiences] = useState([])
  useEffect(() => {
    const storedExperiences = JSON.parse(window.localStorage.getItem("experiences") || "[]")
    setExperiences(storedExperiences || [])
  }, [])

  const [name, setName] = useState("")
  useEffect(() => {
    const storedName = window.localStorage.getItem("name") || ""
    setName(storedName)
  }, [])

  const [email, setEmail] = useState("")
  useEffect(() => {
    const storedEmail = window.localStorage.getItem("email") || ""
    setEmail(storedEmail)
  }, [])

  const [phone, setPhone] = useState("")
  useEffect(() => {
    const storedPhone = window.localStorage.getItem("phone") || ""
    setPhone(storedPhone)
  }, [])
  const contactInfo = {
    name,
    email,
    phone,
  }

  return (
    <ResumePDFView keywords={keywords} skills={skills} experiences={experiences} contactInfo={contactInfo} />
  )
}
