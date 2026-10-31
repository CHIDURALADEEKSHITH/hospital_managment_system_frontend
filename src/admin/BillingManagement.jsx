import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./admin.css";

const BillingManagement = () => {

    const navigate = useNavigate();

    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBills();
    }, []);


    const loadBills = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/admin/billing");

            setBills(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(err);

            setBills([]);

            setError(
                err.response?.data ||
                "Unable to load billing information."
            );

        } finally {

            setLoading(false);

        }
    };


    const filteredBills = bills.filter((bill) => {

        const value = search.toLowerCase();

        return (
            String(bill.id || "").includes(value) ||
            String(bill.patientName || "")
                .toLowerCase()
                .includes(value) ||
            String(bill.status || "")
                .toLowerCase()
                .includes(value)
        );

    });


    const calculateTotal = () => {

        return filteredBills.reduce(
            (total, bill) =>
                total + Number(
                    bill.totalAmount ||
                    bill.amount ||
                    0
                ),
            0
        );

    };


    return (

        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <h1>Billing Management</h1>

                    <p>
                        Monitor hospital billing and revenue
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin")}
                >
                    ← Dashboard
                </button>

            </div>


            <div className="billing-summary">

                <div className="billing-summary-card">

                    <span>Total Bills</span>

                    <strong>
                        {filteredBills.length}
                    </strong>

                </div>


                <div className="billing-summary-card">

                    <span>Total Revenue</span>

                    <strong>
                        ₹{calculateTotal().toLocaleString("en-IN")}
                    </strong>

                </div>

            </div>


            <div className="admin-toolbar">

                <div className="search-box">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search bills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <button
                    className="refresh-button"
                    onClick={loadBills}
                >
                    ↻ Refresh
                </button>

            </div>


            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            <div className="admin-table-card">

                <div className="table-header">

                    <div>
                        <h2>Hospital Bills</h2>
                    </div>

                </div>


                {loading ? (

                    <div className="admin-loading">
                        Loading billing information...
                    </div>

                ) : filteredBills.length === 0 ? (

                    <div className="admin-empty">

                        <div className="empty-icon">
                            ₹
                        </div>

                        <h3>No Billing Records</h3>

                        <p>
                            No billing records are currently available.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>
                                    <th>Bill ID</th>
                                    <th>Patient</th>
                                    <th>Amount</th>
                                    <th>Payment Status</th>
                                    <th>Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredBills.map((bill) => (

                                    <tr key={bill.id}>

                                        <td>
                                            <strong>
                                                {bill.id}
                                            </strong>
                                        </td>

                                        <td>
                                            {bill.patientName ||
                                                bill.patientId ||
                                                "-"}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                bill.totalAmount ||
                                                bill.amount ||
                                                0
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>

                                            <span className="status-badge status-approved">
                                                {bill.status ||
                                                    bill.paymentStatus ||
                                                    "UNKNOWN"}
                                            </span>

                                        </td>

                                        <td>
                                            {bill.date ||
                                                bill.billDate ||
                                                "-"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default BillingManagement;