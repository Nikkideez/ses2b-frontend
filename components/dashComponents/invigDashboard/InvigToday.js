import React, { useState, useEffect } from 'react'
import axios from 'axios'


export default function InvigToday() {
  useEffect(() => {
    getExams()
  }, [])
  const [exams, setExams] = useState([])
  const getExams = async () => {
    await axios({
      method: "GET",
      withCredentials: true,
      url: "https://protoruts-backend.herokuapp.com/student/invigilator/8025498",
    }).then((res) => {
      console.log(res.data)
      setExams(res.data);
      // students = res.data;
    })
  }

  return (
    <div>
      Hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
    </div>
  )
}
