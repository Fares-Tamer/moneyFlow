import React from 'react'

export default function FilterTab({ setFilterTap, filterTap }) {
    const filters = [
        { value: "all", label: "All Meals" },
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Dinner", label: "Dinner" },
        { value: "Snack", label: "Snack" },
    ];
    return <>
        <div className='p-8 border-b border-white/10 '>
            <div className='flex bg-gray-800/50 p-2 rounded-xl space-x-2 mx-auto sm:justify-between text-white gap-2 flex-wrap'>
                {
                    filters.map((filter , index) => {
                        return <div key={index} className={`${filterTap === filter.value ? "bg-linear-to-r from-emerald-500 to-teal-500" : "bg-white/5"} rounded-2xl p-2 text-center `}>
                            <button onClick={() => setFilterTap(filter.value)} className='py-1 sm:py-3 px-1 sm:px-6 rounded-2xl text-sm font-semibold capitalize transition-all duration-200 cursor-pointer'>
                                {filter.label}
                            </button>
                        </div>
                    })
                }
            </div>
        </div>
    </>
}
