import { useEffect, useState } from "react";
import { editInvoice, getInvoiceById } from "../api";
import BackButton from "./BackButton";

const EditInvoice = ({ setShowEditInvoice, invoiceId, setInvoiceId }) => {
    const [invoiceData, setInvoiceData] = useState({
        createdAt: "",
        paymentDue: "",
        description: "",
        paymentTerms: "30",
        clientName: "",
        clientEmail: "",
        status: "Draft",
        senderAddress: {
            street: "",
            city: "",
            postCode: "",
            country: "",
        },
        clientAddress: {
            street: "",
            city: "",
            postCode: "",
            country: "",
        },
        items: [
            {
                name: "",
                quantity: 0,
                price: 0,
                total: 0,
            },
        ],
        total: 0,
    });
   
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
        
    }, [invoiceId]);

    const handleForm = (e, section, field, index = null) => {
        const { value } = e.target;

        if (section === "items" && index !== null) {
            setInvoiceData((prev) => {
                const updatedItems = [...prev.items];
                const updatedItem = {
                    ...updatedItems[index],
                    [field]: field === "quantity" || field === "price" ? Number(value) : value,
                };
                updatedItem.total = updatedItem.quantity * updatedItem.price;
                updatedItems[index] = updatedItem;
                return {
                    ...prev,
                    items: updatedItems,
                };
            });
        } else if (section) {
            setInvoiceData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setInvoiceData((prev) => {
                if (field === "createdAt" || field === "paymentTerms") {
                    const createdAt = field === "createdAt" ? value : prev.createdAt;
                    const terms = field === "paymentTerms" ? Number(value) : Number(prev.paymentTerms);
                    const paymentDue = createdAt
                        ? new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + terms))
                            .toISOString()
                            .split('T')[0]
                        : "";
                    return {
                        ...prev,
                        createdAt,
                        paymentTerms: terms.toString(),
                        paymentDue,
                    };
                }
                return {
                    ...prev,
                    [field]: value,
                };
            });
        }
    };

    const removeItem = (index) => {
        setInvoiceData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!invoiceData.createdAt) {
            setError("Invoice Date is required");
            return;
        }

        const grandTotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
        const payload = { ...invoiceData, total: grandTotal };

        try {
            const response = await editInvoice(invoiceId, payload);
            if (response) {
                setSuccess("Invoice updated successfully");
            } else {
                setError("Failed to update invoice");
            } 
        } catch (error) {
            console.error("Error updating invoice:", error);
            setError("Failed to update invoice");
        }
    };

    const handleBack = () => {
        setShowEditInvoice(false)
        setInvoiceId(invoiceId)
    }
    
   

    return (
        <section className="absolute z-30 inset-0 bg-white dark:bg-[#141625] p-4 md:top-0 md:left-0  md:w-[616px] md:p-10 h-full overflow-y-auto lg:left-24">
            <BackButton onClick={handleBack}/>
            <h2 className="font-bold text-2xl mb-4 dark:text-white">Edit <span className="text-[#888EB0]">#</span>{invoiceData.id}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit} >
                <div>
                    <h3 className="font-bold text-[#7C5DFA] mb-5">Bill from</h3>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Street Address
                        <input
                            type="text"
                            value={invoiceData.senderAddress.street}
                            onChange={(e) => handleForm(e, "senderAddress", "street")}
                            className="border border-[#DFE3FA] rounded-lg p-2 w-full my-2 dark:bg-[#252945] dark:border-transparent dark:text-white"
                        />
                    </label>
                    <div className="flex flex-row justify-between w-full mb-4">
                    <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                        City
                        <input
                            type="text"
                            value={invoiceData.senderAddress.city}
                            onChange={(e) => handleForm(e, "senderAddress", "city")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white "
                        />
                    </label>
                    <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                        Post Code
                        <input
                            type="text"
                            value={invoiceData.senderAddress.postCode}
                            onChange={(e) => handleForm(e, "senderAddress", "postCode")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                        />
                    </label>
                    </div>
                    <label className="flex flex-col text-[#7E88C3] dark:text-[#888EB0] mb-7">
                        Country
                        <input
                            type="text"
                            value={invoiceData.senderAddress.country}
                            onChange={(e) => handleForm(e, "senderAddress", "country")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full dark:text-white"
                        />
                    </label>
                </div>

                <div>
                    <h3 className="font-bold text-[#7C5DFA] mb-5">Bill To</h3>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Client's Name
                        <input
                            type="text"
                            value={invoiceData.clientName}
                            onChange={(e) => handleForm(e, null, "clientName")}
                             className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Client's Email
                        <input
                            type="text"
                            value={invoiceData.clientEmail}
                            onChange={(e) => handleForm(e, null, "clientEmail")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Street Address
                        <input
                            type="text"
                            value={invoiceData.clientAddress.street}
                            onChange={(e) => handleForm(e, "clientAddress", "street")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <div className="flex flex-row justify-between w-full mb-4">
                    <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                        City
                        <input
                            type="text"
                            value={invoiceData.clientAddress.city}
                            onChange={(e) => handleForm(e, "clientAddress", "city")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                        />
                    </label>
                    <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                        Post Code
                        <input
                            type="text"
                            value={invoiceData.clientAddress.postCode}
                            onChange={(e) => handleForm(e, "clientAddress", "postCode")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                        />
                    </label>
                    </div>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Country
                        <input
                            type="text"
                            value={invoiceData.clientAddress.country}
                            onChange={(e) => handleForm(e, "clientAddress", "country")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Invoice Date
                        <input
                            type="date"
                            value={invoiceData.createdAt}
                            onChange={(e) => handleForm(e, null, "createdAt")}
                             className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                            
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0] flex flex-col ">
                        Payment Terms
                        <select
                            value={invoiceData.paymentTerms}
                            onChange={(e) => handleForm(e, null, "paymentTerms")}
                              className="border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent h-12 rounded-lg p-3 font-bold text-black my-2 dark:text-white"
                        >
                            <option value="1">Net 1 Day</option>
                            <option value="7">Net 7 Days</option>
                            <option value="14">Net 14 Days</option>
                            <option value="30">Net 30 Days</option>
                        </select>
                    </label>
                   
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Description
                        <input
                            type="text"
                            value={invoiceData.description}
                            onChange={(e) => handleForm(e, null, "description")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                </div>

                <div className="flex flex-col mt-2">
                    <h3 className="font-bold text-[#777F98] dark:text-[#888EB0] text-lg mb-4">Item List</h3>
                    {invoiceData.items.map((item, index) => (
                        <div key={index}  className="my-2">
                            <div className="hidden lg:flex lg:flex-row lg:justify-between lg:items-center mb-2 lg:text-[13px] text-[#7E88C3]">
                                <label htmlFor="" className="w-[214px]">Item name</label>
                                <label htmlFor="">Qty.</label>
                                <label htmlFor="">Price</label>
                                <label htmlFor="">Total</label>
                            </div>
                            <div className="lg:flex lg:flex-row lg:justify-between lg:items-center">
                                <label className="text-[#7E88C3] text-[13px] dark:text-[#888EB0]">
                                    <span className="lg:hidden">Item Name</span>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleForm(e, "items", "name", index)}
                                        className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white lg:w-[214px] lg:mr-16"
                                    />
                                </label>
                                <div className="flex flex-row items-center p-2">
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                    <span className="lg:hidden">Qty.</span>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleForm(e, "items", "quantity", index)}
                                        className="h-12 w-16 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white  lg:mr-2"
                                    />
                                </label>
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                    <span className="lg:hidden">Price</span>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleForm(e, "items", "price", index)}
                                        className="h-12 w-24 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white  lg:mr-2"
                                    />
                                </label>
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                    <span className="lg:hidden">Total</span>
                                    <input type="number" value={item.total} readOnly className="h-12 w-20 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white"/>
                                </label>
                                {invoiceData.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setInvoiceData((prev) => ({
                                ...prev,
                                items: [
                                    ...prev.items,
                                    { name: "", quantity: 0, price: 0, total: 0 },
                                ],
                            }))
                        }
                        className="flex flex-row items-center justify-center bg-[#F9FAFE] text-[#7E88C3] dark:text-[#888EB0] rounded-lg p-2 w-full my-2 shadow-md mb-4 dark:bg-[#252945]"
                        
                    >
                        Add Item
                    </button>
                </div>

                
            </form>

           

            <div className="mt-3 shadow-initial flex flex-row justify-end items-center w-full  px-2 dark:bg-[#1E2139] py-4 ">
                <button 
                    className="flex flex-col justify-center text-sm bg-[#F9FAFE] h-12 text-[#7E88C3] p-4 rounded-3xl shadow-md dark:bg-[#252945] dark:text-white mr-2 md:mr-4"
                    onClick={handleBack}
                >
                    Cancel
                </button>
                
                <button 
                    className="flex flex-col justify-center text-sm text-white font-bold bg-[#7C5DFA] rounded-3xl p-4 h-12  "
                    onClick={() =>  {handleSubmit(), setInvoiceId(invoiceId), setShowEditInvoice(false)}}
                >
                    Save Changes
                </button>
            </div>
        </section>
    );
};

export default EditInvoice;