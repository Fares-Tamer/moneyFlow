import { Calendar, Edit2, Trash2, Utensils, UtensilsCrossed } from 'lucide-react'
import {
    Sunrise,
    Moon,
    Apple,
    CircleHelp
} from "lucide-react";
import React from 'react'

export default function ExpensesList({ setTransactions, transactions, filterTap, setEditingId, formData, setFormData, setId, editingId }) {

    const today = new Date().toISOString().split("T")[0];

    const filteredTransactions = transactions.filter((trans) => {
        if (trans.date !== today) {
            return false;
        }
        if (filterTap === "all") {
            return true;
        }
        return trans.category.toLowerCase() === filterTap.toLowerCase();
    });

    const deleteTransaction = (id) => {
        setTransactions((prev) => {
            return prev?.filter((trans) => trans.id !== id)
        })
    }

    const editTransaction = (id) => {
        const selectedTransaction = transactions.find((trans) => trans.id === id)

        if (!selectedTransaction) return

        setFormData({
            description: selectedTransaction.description,
            amount: selectedTransaction.amount,
            category: selectedTransaction.category,
            date: selectedTransaction.date,
        })
        setEditingId(true)
        setId(id)
    }

    const getMealIcon = (category) => {
        switch (category) {
            case "breakfast":
                return <Sunrise className="w-6 h-6 text-yellow-400" />;

            case "lunch":
                return <UtensilsCrossed className="w-6 h-6 text-emerald-400" />;

            case "dinner":
                return <Moon className="w-6 h-6 text-indigo-400" />;

            case "snack":
                return <Apple className="w-6 h-6 text-orange-400" />;

            default:
                return <CircleHelp className="w-6 h-6 text-gray-400" />;
        }
    };

    const getMealColor = (category) => {
        switch (category) {
            case "breakfast":
                return "bg-yellow-500/15";

            case "lunch":
                return "bg-emerald-500/15";

            case "dinner":
                return "bg-indigo-500/15";

            case "snack":
                return "bg-orange-500/15";

            default:
                return "bg-gray-500/15";
        }
    };


    return <>
        <div className='p-8 max-h-100 overflow-y-auto'>
            {
                transactions?.length === 0 ? (
                    <div className='text-center py-16'>
                        <div className='p-6 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl inline-block mb-6'>
                            <UtensilsCrossed className='w-16 h-16 text-purple-400' />
                        </div>
                        <p className='text-gray-300 text-xl mb-2'>No meals logged yet</p>
                        <p className='text-gray-500'>Start tracking your nutrition by logging your first meal.</p>
                    </div>
                ) : <div className='space-y-4'>
                    {
                        filteredTransactions.map((trans, index) =>
                            <div key={trans.id} className='flex items-center justify-between p-2 md:p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50 trans-all duration-200'>
                                <div className={`flex items-center space-x-2 md:space-x-6 `}>
                                    <div className={`p-3 rounded-2xl ${getMealColor(trans.category)}`}>
                                        {getMealIcon(trans.category)}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-white text-lg '>
                                            {trans.description}
                                        </p>
                                        <div className='flex items-center space-x-3 md:space-x-6 text-sm text-gray-400 mt-1'>
                                            <span className='flex items-center gap-1 sm:gap-2'>
                                                <Utensils className='w-4 h-4' />
                                                {trans.category}
                                            </span>
                                            <span className='flex items-center'>
                                                <Calendar className='w-4 h-4 mr-2' />
                                                {trans.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row items-center md:space-x-4'>
                                    <span className={`text-blue-500 font-bold sm:text-2xl`}>
                                        {trans.amount} Kcal
                                    </span>
                                    <div className='flex items-center md:space-x-3'>
                                        <button className='p-3 text-gray-400 hover:text-cyan-400 rounded-xl transition-all duration-200 cursor-pointer' onClick={() => editTransaction(trans.id)}>
                                            <Edit2 className='w-5 h-5' />
                                        </button>
                                        <button
                                            disabled={editingId}
                                            className={`${editingId ? "cursor-not-allowed hover:text-gray-100" : "hover:text-red-400 cursor-pointer"} p-3 text-gray-400 rounded-xl transition-all duration-200`}
                                            onClick={() => deleteTransaction(trans.id)}>
                                            <Trash2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )
                    }</div>



            }


        </div >


    </>
}
