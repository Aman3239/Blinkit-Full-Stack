import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { IoMdArrowRoundBack } from "react-icons/io";
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobile] = useMobile()

    const [isSearchPage, setIsSearchPage] = useState(false)
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    }, [location])
    const redirectToSearchPage = () => {
        navigate("/search")
    }

    // console.log("search", isSearchPage)

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }
    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-9 lg:h-10 rounded-lg border overflow-hidden flex items-center  text-neutral-500 bg-slate-50 group focus-within:border-primary-200'>
            <div>

                {
                    (isMobile && isSearchPage) ? (
                        <Link to={"/"} className='flex justify-center items-center h-full p-1 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'>
                            <IoMdArrowRoundBack size={20} />
                        </Link>
                    ) : (
                        <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
                            <IoSearchOutline size={22} />
                        </button>
                    )
                }

            </div>
            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        //not searh page
                        <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                            <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed out once, initially
                                    'Search "milk"',
                                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "panner"',
                                    1000,
                                    'Search "chocklete"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "egg"',
                                    1000,
                                    'Search "chips"'
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        //in search page
                        <div className='w-full h-full '>
                            <input type="text"
                                placeholder='Search for aata dall and more...'
                                autoFocus
                                className='bg-transparent w-full h-full outline-none'
                                onChange={handleOnChange}
                                defaultValue={searchText}
                            />
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Search