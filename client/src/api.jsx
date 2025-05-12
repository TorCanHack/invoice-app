import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getInvoiceRecords = async () => {
    try {
        const response = await api.get("/invoice");
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice records:", error);
        throw error;
    }
};

export const addNewInvoice = async (invoiceData) => {
    try {
        const response = await api.post("/invoice", invoiceData);
        return response.data;
    } catch (error) {
        console.error("Error adding new invoice:", error);
        throw error;
    }
}

export const getInvoiceById = async (id) => {
    try {
        const response = await api.get(`/invoice/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice by ID:", error);
        throw error;
    }
}

export const editInvoice = async (id, data) => {
    try {
        const response = await api.put(`/invoice/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error editing invoice", error)
        throw error;
    }
}

export const deleteInvoice = async (id) => {
    try {
        const response = await api.delete(`/invoice/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice:", error);
        throw error;
    }
}