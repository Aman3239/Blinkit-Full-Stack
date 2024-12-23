import React from 'react'
import NoDataImage from '../assets/nothing here yet.webp'

const NoData = () => {
    return (
        <div className='flex items-center justify-center  flex-col p-4 gap-2'>
            <img src={NoDataImage} alt="No data"
                className='w-36'
            />
            <p className='text-neutral-500'>No Data</p>
        </div>
    )
}

export default NoData