import { useEffect, useState } from "react";
import { getInvoiceRecords } from "../api";
import icon_down from '../assets/icon-arrow-down.svg'
import icon_check from '../assets/icon-check.svg'
import icon_plus from '../assets/icon-plus.svg'
import icon_right from '../assets/icon-arrow-right.svg'
import NewInvoice from "./NewInvoice";
import EmptyInvoice from "./EmptyInvoice";
import ViewInvoice from "./ViewInvoice";
import EditInvoice from "./EditInvoice";
import { useNavigate } from "react-router-dom";

const Invoice = ({setInvoiceId}) => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [showDafts, setShowDrafts] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const [showPaid, setShowPaid] = useState(false);
    const [createNewInvoice, setCreateNewInvoice] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchInvoiceRecords = async () => {
            try {
                const response = await getInvoiceRecords();
                setData(response);
                setFilteredData(response);

            } catch (error) {
                console.error("Error fetching invoice records:", error);
            }
        }
        fetchInvoiceRecords();
    }, [])
    
    useEffect(() => {
        if (!showDafts && !showPending && !showPaid) {
            setFilteredData(data);
            return
        }

        const filtered = data.filter((item) => {
            if (showDafts && item.status === "draft") {
                return true;
            }
            if (showPending && item.status === "pending") {
                return true;
            }
            if (showPaid && item.status === "paid") {
                return true;
            }
            return false;
        }
        );
        setFilteredData(filtered);
    }
    , [showDafts, showPending, showPaid, data]);

    const handleCreateNewInvoice = () => {
        setCreateNewInvoice(true);
    }

    const viewInvoice = (id) => {
        setInvoiceId(id);
        navigate("/viewInvoice");
    }

    return (
        <section className="relative p-4 min-h-full bg-[#F8F8FB] dark:bg-[#141625] lg:w-full lg:px-68 lg:py-20 lg:overflow-auto lg:min-h-screen">
            {createNewInvoice && <NewInvoice setCreateNewInvoice={setCreateNewInvoice} />}
            {createNewInvoice && <div className="bg-black fixed inset-0 z-20 opacity-50 h-full"></div>}
            
            <article className="flex flex-row justify-between items-center mb-4 lg:mb-14">
                <div>
                    <h1 className="font-bold text-2xl text-[#0C0E16] dark:text-white">Invoices</h1>
                    <p className="text-[13px] text-[#888EB0] dark:text-[#DFE3FA]"> <span className="hidden">There are</span> {filteredData.length} {showDafts ? <span>Drafts</span> : showPending ? <span>Pending</span> : showPaid ? <span>Paid</span> : !showDafts && !showPaid && !showPending ? <span className="hidden">total</span> : null }  invoices</p>
                    
                </div>

              <div className="flex flex-row justify-between items-center w-1/2 md:w-96">
                    <div className="flex flex-row justify-between items-center w-14 md:w-36">
                            <h2 className="font-bold text-[15px] dark:text-white md:flex md:flex-row">Filter <span className="hidden md:flex flex-row ml-1">by status</span></h2>
                            <button onClick={() => setShowFilter(!showFilter)}>
                                <img src={icon_down} alt="icon down" />
                            </button>
                            <ul className={`${showFilter ? "w-36  bg-white p-3 rounded-lg" : "hidden"} absolute top-20 right-12 font-bold shadow-md z-30 md:right-56 md:w-48 md:p-6 lg:top-36 lg:right-[480px] text-[#1E2139] `}>
                                <li>
                                    <button className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setShowDrafts(!showDafts)}>
                                        <div className={`${showPaid ? "bg-[#7C5DFA]" : "bg-[#DFE3FA]"} h-4 w-4 flex justify-center items-center mr-3 hover:border hover:border-[#7C5DFA]`}>
                                            {showDafts ? <img src={icon_check} alt="check icon"/> : null}    
                                        </div>
                                        Draft
                                    </button>
                                </li>
                                <li>
                                    <button className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setShowPending(!showPending)}>
                                        <div className={`${showPaid ? "bg-[#7C5DFA]" : "bg-[#DFE3FA]"} h-4 w-4 flex justify-center items-center mr-3 hover:border hover:border-[#7C5DFA]`}>{showPending ? <img src={icon_check} alt="check icon"/> : null}
                                        </div>
                                        Pending
                                    </button>
                                </li>
                                <li>
                                    <button className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setShowPaid(!showPaid)}>
                                        <div className={`${showPaid ? "bg-[#7C5DFA]" : "bg-[#DFE3FA]"} h-4 w-4 flex justify-center items-center mr-3 hover:border hover:border-[#7C5DFA]`}>
                                            {showPaid ? <img src={icon_check} alt="check icon" className="w-3 h-3"/> : null}
                                        </div>
                                        Paid
                                    </button>
                                </li>
                            </ul>
                    </div>

                    <div className=" flex flex-row justify-between items-center bg-[#7C5DFA] px-3 py-2 rounded-3xl md:w-40 hover:bg-[#9277FF]">
                            <button className="cursor-pointer h-8 w-8 bg-white rounded-full flex justify-center items-center mr-2" onClick={handleCreateNewInvoice}>
                                <img src={icon_plus} alt="plus" className=""/>

                            </button>
                            <h2 className="font-bold text-white md:flex md:flex-row">New <span className="hidden md:flex ml-1">Invoice</span></h2>
                    </div>
              </div>
                
            </article>

            <article>
                { filteredData.length > 0 ? 
                
                <div>

                
                    {filteredData.map((item, index) => (
                       
                        <div 
                            key={index}   
                            className="mb-4 bg-white dark:bg-[#1E2139] rounded-lg p-4 shadow-md flex flex-col justify-between w-full cursor-pointer md:flex-row md:items-center md:pointer-events-none"
                            onClick={() => viewInvoice(item.id)}
                        >
                            <div className="flex flex-row justify-between my-3">
                                <h2 className="text-[15px] font-bold dark:text-white "><span className="text-[#7E88C3]">#</span>{item.id}</h2>
                                <p className="text-[#858BB2] text-[13px] dark:text-white md:relative md:left-52 md:w-32 ">{item.clientName}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center"> 
                                <div className="md:flex md:flex-row md:items-center md:justify-between md:w-56">
                                    <p className="text-[#7E88C3] text-[13px] mb-2 dark:text-[#DFE3FA] md:relative md:right-44 md:mb-0 md:text-left"><span className="text-[#858BB2] dark:text-[#DFE3FA]">Due</span> {item.paymentDue}</p>
                                    <p className="font-bold text-[#0C0E16] dark:text-white">${item.total.toFixed(2)} </p>

                                </div>
                            
                                <p className={`${item.status === "paid" ? "bg-[#F3FDFA] text-[#33D69F] dark:bg-[#1F2B3F]" : item.status === "pending" ? "bg-[#FFF9F0] text-[#FF8F00] dark:bg-[#2B2736] " : "bg-[#F8F8FB] text-[#373B53] dark:bg-[#292C44] dark:text-[#DFE3FA]"} font-bold p-4 rounded-xl md:w-[104px]  md:relative md:left-20  `}>{item.status}</p>
                            </div>
                            <button className="hidden md:flex md:w-4 md:h-4 cursor-pointer md:pointer-events-auto" onClick={() => viewInvoice(item.id)}>
                                <img src={icon_right} alt="right icon" />
                            </button>
                        </div>
                    ))}
                </div>

                :

                <EmptyInvoice/>
}

            </article>


           

            
        </section>
    )
}

export default Invoice;