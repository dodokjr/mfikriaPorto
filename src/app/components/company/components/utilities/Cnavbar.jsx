import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiHistogram } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

function Cnavbar() {
    const params = useLocation()
    const navigate = useNavigate()
    let Links =[
        {name:"Back to porto",link:"/app"},
        {name:"Business",link:"/company/business"},
      ];
      let [open, setOpen] =useState(false);

  return(
    <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><button onClick={() => navigate("/app")}>Go To Porto</button></li>
        <li><a>Business</a></li>
      </ul>
    </div>
    <a className="btn text-white text-xl">Mfikria Business And Investment</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    <li><button onClick={() => navigate("/app")}>Go To Porto</button></li>
      <li><a>Business</a></li>
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn">Subscribe</a>
  </div>
</div>
  )
}

export default Cnavbar;