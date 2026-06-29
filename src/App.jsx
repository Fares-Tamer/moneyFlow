import React, { useEffect, useState } from 'react'
import GoalSetup from './page/GoalSetup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './page/Dashboard'
import ProfilePage from './page/ProfilePage'
export default function App() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("transactions")) || []
  })
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
    targetDuration: '',
    durationUnit: 'weeks',
  })
  const [isEditGoal, setIsEditGoal] = useState(false)
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))

  }, [transactions])



  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoalSetup formData={formData} setFormData={setFormData} setIsEditGoal={setIsEditGoal} isEditGoal={isEditGoal}/>} />
        <Route path="/dashboard" element={<Dashboard setTransactions={setTransactions} transactions={transactions} />} />
        <Route path='/profile' element={<ProfilePage setFormData={setFormData} setIsEditGoal={setIsEditGoal}/>} />
      </Routes>
    </BrowserRouter>



  </>
}
