import { deleteInvoice } from "../api";

const DeleteModal = ({invoiceId, setInvoiceId,  setShowDeleteInvoice, setData, setShowEditInvoice}) => {

    const handleCancelDelete = () => {
        setShowDeleteInvoice(false);
    }

    const handleDeleteInvoice = async () => {
        try { 
             const response = await deleteInvoice(invoiceId);
             setData(response);
             setShowEditInvoice(false)
             setInvoiceId(null)


        } catch(error) {
            console.error("Error deleting invoice", error)
        }
    }

    return (
        <section className="bg-white z-30 p-4 rounded-3xl w-[327px] absolute bottom-72 left-4 md:left-48 md:bottom-[500px] dark:bg-[#1E2139] md:w-[480px] md:h-60 md:p-8 lg:left-[450px]">
            <h1 className="font-bold text-2xl mb-2 dark:text-white ">Confirm Deletion</h1>
            <p className="mb-6 dark:text-[#888EB0] ">Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone</p>
            <div className="w-full flex flex-row justify-end items-center">
                <button 
                    className="bg-[#F9FAFE] text-[#7E88C3] p-3 shadow-md rounded-3xl mr-2 dark:bg-[#252945] dark:text-[#DFE3FA]"
                    onClick={handleCancelDelete}
                    
                >Cancel</button>
                <button className="bg-[#EC5757] text-white rounded-3xl p-3" onClick={handleDeleteInvoice}>Delete</button>
            </div>
        </section>
    )
}

export default DeleteModal;