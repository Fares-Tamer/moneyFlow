import { AlertCircle, UtensilsCrossed } from 'lucide-react'
import React, { useState } from 'react'

export default function AddExpensesForm({ formData, setFormData, editingId, transactions, setTransactions, setEditingId, id }) {

    const [errors, setErrors] = useState({
        description: "",
        amount: "",
        category: "",
        date: "",
        type: "",
    })
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0"
        }
        if (!formData.category) {
            newErrors.category = "Category is required"
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: newValue,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    }


    const createEntry = () => {
        const newTransaction = {
            ...formData,
            id: Date.now(),
            date: new Date().toISOString().split("T")[0],
        }
        setTransactions(prev => ([
            ...prev,
            newTransaction
        ]))
    }

    const updateEntry = () => {
        setTransactions(prev =>
            prev.map(trans =>
                trans.id === id
                    ? { ...trans, ...formData, id: trans.id }
                    : trans
            )
        );
    };


    const handleSubmit = () => {
        if (!validateForm()) return;
        if (editingId) {
            updateEntry();
        } else {
            createEntry();
        }
        setFormData({
            description: "",
            amount: "",
            category: "",
            date: "",
            type: "income",
        })
        setEditingId(false);

    }

    const cancelEdit = () => {
        setFormData({
            description: "",
            amount: "",
            category: "",
            date: "",
            type: "income",
        })
    }




    return <>
        <div className='p-8 border border-white rounded-3xl shadow-2xl'>
            <h2>
                <div className='text-2xl flex items-center font-bold text-white mb-8'>
                    <div className='p-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl mr-3'>
                        <UtensilsCrossed className='w-6 h-6 text-white' />
                    </div>
                    {editingId ? "Update Meal" : "Log Your Meal"}
                </div>
            </h2>
            <div className='space-y-6'>

                <div>
                    <label className='block text-gray-300 text-sm font-semibold mb-3'>
                        Meal Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Chicken & Rice"
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 ${errors.description && " border-red-500"}`}
                        name='description'
                        value={formData.description}
                        onChange={handleChange} />
                    {
                        errors.description && (
                            <p className='text-red-500 text-sm mt-2 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {errors.description}
                            </p>
                        )
                    }
                </div>
                <div>
                    <label className='block text-gray-300 text-sm font-semibold mb-3'>
                        Calories
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 750 kcal"
                        value={formData.amount}
                        name='amount'
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-purple-500 ${errors.amount && " border-red-500"}`}
                        onChange={handleChange}
                    />
                    {
                        errors.amount && (
                            <p className='text-red-500 text-sm mt-2 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {errors.amount}
                            </p>
                        )
                    }
                </div>
                <div>
                    <label className='block text-gray-300 text-sm font-semibold mb-3'>
                        Category
                    </label>
                    <select
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-purple-500 ${errors.category && "border-red-500"} *:text-black`}
                        name='category'
                        value={formData.category}
                        onChange={handleChange}>
                        <option value="">Select Meal Type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                    {
                        errors.category && (
                            <p className='text-red-500 text-sm mt-2 flex items-center'>
                                <AlertCircle className='w-4 h-4 mr-1' />
                                {errors.category}
                            </p>
                        )
                    }
                </div>
                
                <div className='flex items-center w-full space-x-4'>
                    <button
                        onClick={handleSubmit}
                        type='button'
                        className={`${editingId ? "w-1/2" : "w-full"} bg-linear-to-r from-emerald-500 to-teal-500 text-whitepy-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer py-3 `}>
                        {
                            editingId ? "Edit Meal" : "Add Meal"
                        }
                    </button>
                    {
                        editingId ? <button onClick={() => { cancelEdit(), setEditingId(false) }} className='w-1/2 border-2 border-gray-600 text-gray-300 rounded-2xl hover:bg-red-500/10 transition-all duration-200 cursor-pointer py-3 hover:border-red-500/40 hover:text-red-300'>
                            Cancel
                        </button> : ""
                    }
                </div>
            </div>
        </div>




    </>
}
