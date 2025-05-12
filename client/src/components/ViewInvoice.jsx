import { useEffect, useState } from "react"
import BackButton from "./BackButton";
import { getInvoiceById } from "../api";
import DeleteModal from "./DeleteModal";
import EditInvoice from "./EditInvoice";
import { useNavigate } from "react-router-dom";

const ViewInvoice = ({invoiceId, setInvoiceId,  setData,}) => {

    const [invoiceData, setInvoiceData] = useState([]);
    const [showEditInvoice, setShowEditInvoice] = useState(false)
    const [showDeleteInvoice, setShowDeleteInvoice] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await getInvoiceById(invoiceId);
                setInvoiceData(response);
            } catch (error) {
                console.error("Error fetching invoice:", error);
            }
        }
        fetchInvoice();
    }
    , [invoiceId]);

    const handleBackButton = () => {
        navigate("/");
    }

    const handleEditButton = () => {
        setShowEditInvoice(true);
        setInvoiceId(invoiceData.id);
        
    }

    const handleShowDeleteModal = () => {
        setShowDeleteInvoice(true)
    }
    const grandTotal = invoiceData.total?.toFixed(2);



    return (
        <section className="relative z-20  bg-[#F8F8FB]   min-h-screen dark:bg-[#141625] lg:w-full lg:px-68 lg:py-20 lg:overflow-auto lg:min-h-screen">
            {invoiceId && showEditInvoice && <EditInvoice invoiceId={invoiceId} setInvoiceId={setInvoiceId} setShowEditInvoice={setShowEditInvoice} />}
            {(showDeleteInvoice || showEditInvoice) && <div className="bg-black fixed inset-0 z-20 opacity-50 h-full"></div>}
            <div className="p-4">
                <BackButton onClick={handleBackButton}/>
                <div className="flex flex-row justify-between items-center bg-white  p-4 rounded-xl dark:bg-[#1E2139] lg:px-8">
                    <div className="md:w-40 md:flex md:flex-row md:items-center">
                        <p className="text-[#858BB2] leading-3 text-[13px] dark:text-[#DFE3FA] md:mr-4">Status</p>
                        <div 
                            className={`${invoiceData.status === "paid" ? "bg-[#F3FDFA] text-[#33D69F] dark:text-[#1A6B50] dark:bg-[#101620]" : invoiceData.status === "pending" ? "bg-[#FFF9F0] text-[#FF8F00] dark:bg-[#2B2736] " : "bg-[#F8F8FB] text-[#373B53] dark:bg-[#292C44] dark:text-[#DFE3FA]"} font-bold p-4 rounded-xl w-24 flex flex-row items-center`}
                        > 
                            <div className={`${invoiceData.status === "paid" ? "bg-[#33D69F]  dark:bg-[#1A6B50]" : invoiceData.status === "pending" ? "bg-[#FF8F00] dark:bg-[#2B2736] " : "bg-[#F8F8FB] text-[#373B53] dark:bg-[#292C44] dark:text-[#DFE3FA]"} w-2 h-2 rounded-full mr-2`}></div>
                                
                            {invoiceData.status}
                        </div>
                    </div>

                    <div className="hidden bg-white flex-row justify-between items-center p-4 dark:bg-[#1E2139] md:flex md:w-[309px]">
                        <button className="bg-[#F9FAFE] rounded-3xl p-3 shadow-md dark:bg-[#252945] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] cursor-pointer" onClick={handleEditButton}>Edit</button>
                        <button className="bg-[#EC5757] rounded-3xl p-3 text-white font-bold hover:bg-[#FF9797] cursor-pointer" onClick={handleShowDeleteModal}>Delete</button>
                        <button className="bg-[#7C5DFA] rounded-3xl p-3 text-white font-bold lg:hover:bg-[#9277FF] cursor-pointer">Mark as Paid</button>
                    </div>
                    
                </div>

                <article className="bg-white p-4 rounded-xl mt-4 dark:bg-[#1E2139]">
                    <div className="md:flex md:flex-row md:justify-between md:items-center md:mb-6">
                        <div className="md:flex md:flex-col">
                            <h2 className="font-bold dark:text-white md:mb-2"><span className="text-[#858BB2]">#</span>{invoiceData.id}</h2>
                            <p className="text-[#858BB2] dark:text-[#DFE3FA] mb-6">{invoiceData.description}</p>
                        </div>

                        <div className="text-[13px] text-[#858BB2] dark:text-[#DFE3FA] mb-6">
                                <p>{invoiceData.senderAddress?.street || ''}</p>
                                <p className="md:text-right">{invoiceData.senderAddress?.city || ''}</p>
                                <p className="md:text-right">{invoiceData.senderAddress?.postCode || ''}</p>
                                <p>{invoiceData.senderAddress?.country || ''}</p>
                        </div>
                    </div>

                    <div className="md:flex md:flex-row md:justify-start md:items-start md:mb-6">
                        <div className="flex flex-row justify-between items-center mb-6 md:w-80 md:mr-28">
                            <div>
                                <p className="text-[#858BB2] dark:text-[#DFE3FA] text-[13px] mb-2">invoice date </p> 
                                
                                <p className="font-bold text-black text-[15px] mb-8 dark:text-white">{invoiceData.createdAt}</p>
                                <p className="text-[#858BB2] dark:text-[#DFE3FA] text-[13px] mb-2">payment due </p>
                                <p className="font-bold text-black text-[15px] dark:text-white">{invoiceData.paymentDue}</p>
                            </div>

                            <div className="text-[#858BB2] dark:text-[#DFE3FA] text-[13px]">
                                <h3 className="mb-2">Bill to</h3>
                                <p className="font-bold text-[15px] text-black mb-2 dark:text-white">{invoiceData.clientName}</p>
                                <p>{invoiceData.clientAddress?.street || ''}</p>
                                <p>{invoiceData.clientAddress?.city || ''}</p>
                                <p>{invoiceData.clientAddress?.postCode || ''}</p>
                                <p>{invoiceData.clientAddress?.country || ''}</p>
                            
                            </div>
                        </div>

                        <div>
                            <p className="text-[#858BB2] dark:text-[#DFE3FA] text-[13px] mb-2">Sent to</p>
                            <p className=" text-[13px] font-bold mb-4 dark:text-white">{invoiceData.clientEmail}</p>

                        </div>
                    </div>

                    

                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className="bg-[#F9FAFE] flex flex-row justify-between items-center p-4 rounded-xl w-[279px] dark:bg-[#252945] md:flex-col md:w-full">
                            <div className="hidden md:flex md:flex-row md:justify-between md:w-full md:my-4">
                                <p className="md:w-60">Item Name</p>
                                <p>QTY.</p>
                                <p>Price.</p>
                                <p>Total</p>
                            </div>
                           <div className="md:flex md:flex-row md:justify-between md:items-center md:w-full"> 
                                <div className="md:flex md:flex-row md:justify-between md:items-center" >
                                    <p className="font-bold text-[15px] mb-1 dark:text-white md:w-[360px] lg:w-[400px]">{item.name}</p>
                                    <div className="flex flex-row  items-center text-[#7E88C3] dark:text-[#888EB0]  font-bold md:justify-between">
                                        <p className="md:mr-36">{item.quantity}<span className="mx-1 md:hidden">x</span></p>
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                <p className="font-bold dark:text-white">${item.total.toFixed(2)}</p>
                           </div>
                        </div>
                    ))}

                    <div className="flex flex-row justify-between items-center h-20 w-[279px] px-4 bg-[#373B53] text-white rounded-b-xl dark:bg-[#0C0E16] dark:text-white md:w-full">
                        <p>Grand Total</p>
                        <h2 className="font-bold text-2xl">${grandTotal}</h2>
                    </div>

                
                
                </article>

            </div>
            

            <div className="bg-white flex flex-row justify-between items-center p-4 dark:bg-[#1E2139] md:hidden">
                <button className="bg-[#F9FAFE] rounded-3xl p-3 shadow-md dark:bg-[#252945] dark:text-[#DFE3FA]" onClick={handleEditButton}>Edit</button>
                <button className="bg-[#EC5757] rounded-3xl p-3 text-white font-bold" onClick={handleShowDeleteModal}>Delete</button>
                <button className="bg-[#7C5DFA] rounded-3xl p-3 text-white font-bold">Mark as Paid</button>
            </div>
            {showDeleteInvoice && <DeleteModal invoiceId={invoiceId} setInvoiceId={setInvoiceId} setShowDeleteInvoice={setShowDeleteInvoice} setData={setData} setShowEditInvoice={setShowEditInvoice}/>}

        </section>
    )
}

export default ViewInvoice