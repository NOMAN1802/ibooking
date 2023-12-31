/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Destination from "../SearchToggleComponent/Destination";
import CheckTime from "../SearchToggleComponent/CheckTime";
import { formateDate } from "../../utils/dateConvert";
import { useNavigate } from "react-router-dom";
import Loader from "../Shared/Loader";
import MatchRoom from "./MatchRoom";
import axios from "axios";

const SearchForm = ({ setIsRoomOpen }) => {
  const [activeSearch, setActiveSearchText] = useState(false);
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const props = { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate };
  const [find, setFind] = useState(null);
  const [loading, setLoading] = useState(false)
  const [searchRooms, setSearchRooms] = useState([])
  console.log("searchRooms", searchRooms);

  const lists = [
    {
      title: "Rooms",
    },
    {
      title: "Cars",
    },
  ];
  const [active, setActive] = useState(null);

  const handleToggle = (e, find) => {
    e.preventDefault();
    [find].map((type) => setActive(type));
    setFind(find);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const location = form.location.value;
    const checkIn = checkInDate ? checkInDate.toISOString() : '';
    const checkOut = checkOutDate ? checkOutDate.toISOString() : '';
  
    const searchQuery = {
      location: location,
      checkIn,
      checkOut,
    };
  
    const queryString = Object.keys(searchQuery)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(searchQuery[key])}`
      ).join('&');
  
    try {
      setLoading(true);
  
      const response = await axios.get(`http://localhost:5000/roomSearch?${queryString}`);
  
      if (response.data.length === 0) {
      // if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.log('No results found or data format is incorrect');
      } else {
        console.log('else', response.data);
        setSearchRooms(response.data);
      }
  
      setLoading(false);
      // setIsRoomOpen(false);
      // console.log(searchRooms);
      // navigate('/singleSearch');
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("searchResults changed:", searchRooms);
    
  // }, [searchRooms]);


  if (loading) {
    return <Loader />;
  }
  return (
    <>
      {searchRooms.length === 0 ? null : <MatchRoom searchRooms={searchRooms} setIsRoomOpen={setIsRoomOpen}/>}
      <div className="cursor-pointer pt-7  z-10">
        {/* <ul
          onClick={() => setIsOpen(false)}
          className="flex gap-10 justify-center "
        >
          {lists.map((list, index) => (
            <li
              className="text-[16px]  text-gray-900 hover:text-gray-400 hover:border-b-2"
              key={index}
            >
              {list.title}
            </li>
          ))}
        </ul> */}
        <form
          onSubmit={handleSubmit}
          // onClick={() => setActiveSearchText(true)}
          className={` rounded- w-[750px]  border mt-10 grid grid-cols-8  bg-gray-100 z-20 `}
        >
            <div
            onClick={(e) => handleToggle(e, "location")}
            className={` px-4 py-3 ${active == "location"
              ? "bg-white shadow-2xl  "
              : "hover:bg-[#EBEBEB]"
              }   rounded-3xl col-span-3 `}
          >
            <div className="flex  gap-10 items-center  ">
              <div>
                <p className="text-[13px] font-bold">Location</p>
                <input
                  className={` placeholder-gray-400 outline-none bg-transparent bg-[#EBEBEB] text-sm  ${active == "location" && "bg-white "
                    }`}
                  name="location"
                  placeholder="Search locations"
                />
              </div>
            </div>
          </div>
          <div
            onClick={(e) => handleToggle(e, "checkIn")}
            className={` px-4 py-3 ${active == "checkIn"
              ? "bg-white shadow-2xl hover:bg-white  "
              : "hover:bg-[#EBEBEB]"
              }   rounded-3xl  col-span-2`}
          >
            <div className="flex  gap-10 items-center  ">
              <div>
                <p className="text-[13px] font-bold"> Check in</p>
                <p className="text-gray-500 text-sm ">
                  {checkInDate ? (
                    <p className="font-semibold text-black">
                      {formateDate(checkInDate)}
                    </p>
                  ) : (
                    "Add dates"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={(e) => handleToggle(e, "checkOut")}
            className={` px-4 py-3 ${active == "checkOut"
              ? "bg-white shadow-2xl hover:bg-white  "
              : "hover:bg-[#EBEBEB]"
              }   rounded-3xl col-span-2 `}
          >
            <div className="flex  gap-10 items-center  ">
              <div>
                <p className="text-[13px] font-bold">Check out</p>
                <p className="text-gray-500 text-sm ">
                  {checkOutDate ? (
                    <p className="font-semibold text-black">
                      {formateDate(checkOutDate)}
                    </p>
                  ) : (
                    "Add dates"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="text-lg pr-2 bg-slate-500 rounded text-gray-100 flex flex-row  items-center">
          
                <BiSearch size={24}></BiSearch>
                <button type="submit">Search</button>
              </div>
          {/* {
            searchRooms && searchRooms?.map((index, result) => {
              console.log(result);
              return <SearchResult key={index} result={result} />
            })
          } */}


        </form>
      </div>
      <div className="z-50">
        {find == "location" && <Destination></Destination>}
        {find == "checkIn" && <CheckTime props={props} />}
        {find == "checkOut" && <CheckTime props={props} />}
      </div>
    </>
  );
};

export default SearchForm;
