import React, { useEffect, useState } from 'react'

import Header from '../Components/Header'
import AddExpensesForm from '../Components/AddExpensesForm'
import FilterTab from '../Components/FilterTab'
import ExpensesList from '../Components/ExpensesList'
import SummaryCards from '../Components/SummaryCards'
export default function Dashboard({ transactions, setTransactions }) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "",
        date: "",
    })
    const [editingId, setEditingId] = useState(false);
    const [id, setId] = useState("")
    const [filterTap, setFilterTap] = useState("all")
    const today = new Date().toISOString().split("T")[0];
    const profile = JSON.parse(localStorage.getItem("profileResult"))
    const dailyGoal = profile?.dailyGoal
    // calculate total Income & total expenses
    const consumedCalories = transactions.filter((trans) => trans.date === today).reduce((sum, exp) => sum + Number(exp.amount), 0)
    const remainingCalories = Number(dailyGoal) - Number(consumedCalories);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    return <>
        <div className='min-h-screen bg-linear-to-br from-zinc-950 via-slate-900 to-emerald-900 p-4'>
            <div className='max-w-7xl mx-auto'>
                <Header />
                <SummaryCards dailyGoal={dailyGoal} consumedCalories={consumedCalories} remainingCalories={remainingCalories} />
                <div className='grid grid-cols-1 xl:grid-cols-5 gap-6'>
                    <div className='order-2 md:order-1 xl:col-span-2'>
                        <AddExpensesForm formData={formData} setFormData={setFormData} editingId={editingId} transactions={transactions} setTransactions={setTransactions} setEditingId={setEditingId} id={id} />
                    </div>
                    <div className='order-1 md:order-2 xl:col-span-3'>
                        <div className='bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl overflow-hidden'>
                            {/* Filter options */}

                            <FilterTab setFilterTap={setFilterTap} filterTap={filterTap} />

                            {/* Expenses list */}

                            <ExpensesList transactions={transactions} setTransactions={setTransactions} filterTap={filterTap} setEditingId={setEditingId} formData={formData} setFormData={setFormData} setId={setId} editingId={editingId} />

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}
