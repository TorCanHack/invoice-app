import { useState } from "react";
import { addNewInvoice } from "../api"
import icon_delete from "../assets/icon-delete.svg";
import BackButton from "./BackButton";
import icon_plus from '../assets/icon-plus-2.svg'

const NewInvoice = ({setCreateNewInvoice}) => {
    const [formData, setFormData] = useState({
        createdAt: "",
        paymentDue: "",
        description: "",
        paymentTerms: 30,
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

    const handleForm = (e, section, field, index = null) => {
        const { value } = e.target;
    
        if (section === "items" && index !== null) {
            setFormData((prev) => {
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
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => {
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
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);



        const grandTotal = formData.items.reduce((acc, item) => acc + item.total, 0);
        const payload = { ...formData, total: grandTotal };
        try {
            const response = await addNewInvoice(payload);
            console.log("Invoice added successfully:", response);
            setSuccess("Invoice added successfully!");
            setError(null);
            // Reset form after successful submission
            setFormData({
                createdAt: "",
                paymentDue: "",
                description: "",
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
        } catch (error) {
            console.error("Error adding invoice:", error);
            setError(error)
            // Handle error (e.g., show a notification) 
            setSuccess(null);
        }
    }

    const handleBack = () => {
        setCreateNewInvoice(false);
    }

    return (
        <section className="absolute inset-0  min-h-full z-30 bg-white dark:bg-[#141625]  md:top-0 md:left-0  md:w-[616px] md:p-10 h-screen overflow-y-auto md:rounded-r-2xl">
            <BackButton onClick={handleBack}/>
            <h2 className="font-bold text-2xl mb-5 dark:text-white">New Invoice</h2>
            <form action="" className="p-5">
                <div>
                    <h3 className="font-bold text-[#7C5DFA] mb-5">Bill From</h3>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Street Address
                        <input
                            type="text"
                            value={formData.senderAddress.street}
                            onChange={(e) => handleForm(e, "senderAddress", "street")}
                            className="border border-[#DFE3FA] rounded-lg p-2 w-full my-2 dark:bg-[#252945] dark:border-transparent dark:text-white"
                        />
                    </label>
                    <div className="flex flex-row justify-between w-full mb-4">

                    
                        <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                            City
                            <input
                                type="text"
                                value={formData.senderAddress.city}
                                onChange={(e) => handleForm(e, "senderAddress", "city")}
                                className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white "
                            />
                        </label>
                        <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                            Post Code
                            <input
                                type="text"
                                value={formData.senderAddress.postCode}
                                onChange={(e) => handleForm(e, "senderAddress", "postCode")}
                                className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                            />
                        </label>
                    </div>
                    <label className="flex flex-col text-[#7E88C3] dark:text-[#888EB0] mb-7">
                        Country
                        <input
                            type="text"
                            value={formData.senderAddress.country}
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
                            value={formData.clientName}
                            onChange={(e) => handleForm(e, null, "clientName")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Client's Email
                        <input
                            type="text"
                            value={formData.clientEmail}
                            onChange={(e) => handleForm(e, null, "clientEmail")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Street Address
                        <input
                            type="text"
                            value={formData.clientAddress.street}
                            onChange={(e) => handleForm(e, "clientAddress", "street")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <div className="flex flex-row justify-between w-full mb-4">
                        <label className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                            City
                            <input
                                type="text"
                                value={formData.clientAddress.city}
                                onChange={(e) => handleForm(e, "clientAddress", "city")}
                                className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                            />
                        </label>
                        <label  className="inline-flex flex-col text-[#7E88C3] dark:text-[#888EB0] w-36">
                            Post Code
                            <input
                                type="text"
                                value={formData.clientAddress.postCode}
                                onChange={(e) => handleForm(e, "clientAddress", "postCode")}
                                className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full mt-3 dark:text-white"
                            />
                        </label>
                    </div>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Country
                        <input
                            type="text"
                            value={formData.clientAddress.country}
                            onChange={(e) => handleForm(e, "clientAddress", "country")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Invoice Date
                        <input
                            type="date"
                            value={formData.createdAt}
                            onChange={(e) => handleForm(e, null, "createdAt")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0] flex flex-col ">
                        Payment Terms
                        <select
                            value={formData.paymentTerms}
                            onChange={(e) => handleForm(e, null, "paymentTerms")}
                            className="border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent h-12 rounded-lg p-3 font-bold text-black my-2 dark:text-white"
                            
                        >
                            <option value="1" >Net 1 Day</option>
                            <option value="7">Net 7 Days</option>
                            <option value="14">Net 14 Days</option>
                            <option value="30">Net 30 Days</option>
                        </select>
                    </label>
                    <label className="text-[#7E88C3] dark:text-[#888EB0]">
                        Description
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleForm(e, null, "description")}
                            className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white"
                        />
                    </label>
                </div>

                <div className="flex flex-col">
                    <h3 className="font-bold text-[#777F98] dark:text-[#888EB0] text-lg mb-4">Item List</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="my-2">
                            <div className="hidden lg:flex lg:flex-row lg:justify-between lg:items-center mb-2 lg:text-[13px] text-[#7E88C3]">
                                <label htmlFor="" className="w-[214px]">Item name</label>
                                <label htmlFor="">Qty.</label>
                                <label htmlFor="">Price</label>
                                <label htmlFor="">Total</label>
                            </div>
                            <div className="lg:flex lg:flex-row lg:justify-between lg:items-center">
                            <label  className="text-[#7E88C3] text-[13px] dark:text-[#888EB0]">
                                <span className="lg:hidden">Item Name</span>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleForm(e, "items", "name", index)}
                                     className="border border-[#DFE3FA] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 w-full my-2 dark:text-white lg:w-[214px] lg:mr-12"
                                />
                            </label>
                            <div className="flex flex-row items-center p-2">
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                <span className="lg:hidden">Qty.</span>
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        onChange={(e) => handleForm(e, "items", "quantity", index)}
                                        className="h-12 w-16 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white lg:mr-2"
                                    />
                                </label>
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                <span className="lg:hidden">Price</span>
                                    <input
                                        type="text"
                                        value={item.price}
                                        onChange={(e) => handleForm(e, "items", "price", index)}
                                        className="h-12 w-24 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white lg:mr-2"
                                    />
                                </label>
                                <label className="text-[#7E88C3] dark:text-[#888EB0] text-[13px]">
                                <span className="lg:hidden">Total</span>
                                    <input type="number" value={item.total} readOnly className="h-12 w-20 border border-[#7E88C3] dark:bg-[#252945] dark:border-transparent rounded-lg p-2 dark:text-white"/>
                                </label>
                                {formData.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        
                                        
                                    >
                                        <img src={icon_delete} alt="delete icon" />
                                    </button>
                                )}
                            </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                items: [
                                    ...prev.items,
                                    { name: "", quantity: 0, price: 0, total: 0 },
                                ],
                            }))
                        }
                        className="flex flex-row items-center justify-center bg-[#F9FAFE] text-[#7E88C3] dark:text-[#888EB0] rounded-lg p-2 w-full my-2 shadow-md mb-4 dark:bg-[#252945]"
                        
                    >
                        <img src={icon_plus} alt="plus icon" className="mr-1"/>
                        Add New Item
                    </button>
                </div>
            </form>
            <div className="bg-[#F8F8FB] dark:bg-[#141625]  h-16 w-full  py-7 shadow-lg dark:shadow-transparent ">

            </div>

            <div className="mt-3 shadow-initial flex flex-row justify-between items-center w-full  px-2 dark:bg-[#1E2139] py-4 md:px-6">
                <button 
                    className="flex flex-col justify-center text-sm bg-[#F9FAFE] h-12 text-[#7E88C3] p-4 rounded-3xl shadow-md dark:bg-[#252945] dark:text-white"
                    onClick={handleBack}
                >
                    Discard
                </button>
                <button 
                    className="flex flex-col justify-center text-[#888EB0] text-sm font-bold bg-[#373B53] rounded-3xl p-4 h-12 md:relative md:left-14"
                    onClick={handleSubmit}
                >
                    Save as Draft
                </button>
                <button 
                    className="flex flex-col justify-center text-sm text-white font-bold bg-[#7C5DFA] rounded-3xl p-4 h-12  "
                    onClick={() => {setFormData({ ...formData, status: "Pending" }), handleSubmit()}}
                >
                    Save & Send
                </button>
            </div>
        </section>
    );
};

export default NewInvoice;