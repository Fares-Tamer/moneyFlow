import { CircleUserRound, Flame } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate()
    return <>
        <div className='text-center mb-12'>
            <div className='flex items-center justify-center '>
                <div className='p-4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl hover:scale-105 transition-all duration-300 shadow-emerald-500/30 shadow-xl mb-3'>
                    <Flame className='w-12 h-12 text-white' />
                </div>
            </div>
            <h1 className='text-5xl font-bold bg-linear-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent'>GainFlow</h1>
            <p className='text-gray-300 text-base'>Every meal counts. Stay consistent and reach your fitness goals.</p>
        </div>
        <div className='flex items-center justify-end mb-5'>
            <div className="relative group w-fit z-100">
                <button onClick={()=>navigate("/profile")}  className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300">
                    <CircleUserRound className="w-6 h-6 text-white group-hover:text-emerald-400" />
                </button>

                <div
                    className="
            absolute
            top-full
            right-0
            mt-2
            px-3
            py-2
            rounded-xl
            bg-slate-900
            border border-white/10
            text-white
            text-sm
            whitespace-nowrap
            opacity-0
            invisible
            group-hover:opacity-100
            group-hover:visible
            transition-all
            duration-300
            shadow-xl
        "
                >
                    View Profile
                </div>
            </div>
        </div>


    </>
}
