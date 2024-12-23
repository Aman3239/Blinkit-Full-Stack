import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
    const location = useLocation()

    // Safe check to ensure location.state exists
    const successText = location?.state?.text || "Payment"; // Default to "Payment" if text is undefined

    return (
        <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
            <p className='text-green-800 font-bold text-lg text-center'>{successText} Successfully</p>
            <Link to={'/'} className='border border-green-900 rounded transition-all text-green-900 hover:bg-green-900 hover:text-white px-4 py1'>
                Go To Home
            </Link>
        </div>
    )
}

export default Success
