import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function InvigExamTable() {
  useEffect(() => {
    getExams()
  }, [])
  const [exams, setExams] = useState([])
  const getExams = async () => {
    await axios({
      method: "GET",
      withCredentials: true,
      url: "http://protoruts-backend.herokuapp.com/student/invigilator/8025498",
    }).then((res) => {
      console.log(res.data)
      setExams(res.data);
      // students = res.data;
    })
  }
  // console.log(exams)
  return (
    <div>
      
    </div>
  )
}
