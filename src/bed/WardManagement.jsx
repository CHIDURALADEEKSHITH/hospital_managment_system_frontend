import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BedSidebar from "./BedSidebar";
import "./bed.css";

const WardManagement = () => {

    const navigate = useNavigate();

    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWards();
    }, []);

    const loadWards = async () => {
        try {
            const response = await api.get("/bed/beds");

            const beds = response.data || [];

            const wardMap = {};

            beds.forEach((bed) => {

                const wardName = bed.wardName || "Unassigned Ward";

                if (!wardMap[wardName]) {
                    wardMap[wardName] = {
                        name: wardName,
                        rooms: new Set(),
                        totalBeds: 0,
                        availableBeds: 0,
                        occupiedBeds: 0
                    };
                }

                const ward = wardMap[wardName];

                if (bed.roomNumber) {
                    ward.rooms.add(bed.roomNumber);
                }

                ward.totalBeds++;

                if (bed.status === "AVAILABLE") {
                    ward.availableBeds++;
                }

                if (bed.status === "OCCUPIED") {
                    ward.occupiedBeds++;
                }
            });

            const wardList = Object.values(wardMap).map((ward) => ({
                ...ward,
                rooms: ward.rooms.size
            }));

            setWards(wardList);

        } catch (error) {
            console.error("Unable to load wards", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bed-layout">
            <BedSidebar />
            <main className="bed-main bed-page">

            <header className="bed-page-header">

                <div>

                    <button
                        className="bed-back-button"
                        onClick={() => navigate("/bed")}
                    >
                        ← Dashboard
                    </button>

                    <h1>Ward Management</h1>

                    <p>
                        View hospital wards and their bed availability
                    </p>

                </div>

            </header>

            <div className="bed-table-card">

                <div className="bed-table-header">

                    <div>
                        <h2>Hospital Wards</h2>

                        <span>
                            {wards.length} ward(s)
                        </span>
                    </div>

                    <button
                        className="bed-refresh-button"
                        onClick={loadWards}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {loading ? (

                    <div className="bed-loading">
                        Loading wards...
                    </div>

                ) : wards.length === 0 ? (

                    <div className="bed-empty">

                        <div>🏥</div>

                        <h3>No Wards Found</h3>

                        <p>
                            Add beds from Bed Management to create
                            ward information.
                        </p>

                    </div>

                ) : (

                    <div className="bed-card-grid">

                        {wards.map((ward) => (

                            <div
                                className="ward-card"
                                key={ward.name}
                            >

                                <div className="ward-card-icon">
                                    🏥
                                </div>

                                <div className="ward-card-content">

                                    <h3>
                                        {ward.name}
                                    </h3>

                                    <span className="bed-category">
                                        Hospital Ward
                                    </span>

                                    <p>
                                        Rooms: {ward.rooms}
                                    </p>

                                    <p>
                                        Total Beds: {ward.totalBeds}
                                    </p>

                                    <p>
                                        Available Beds:{" "}
                                        {ward.availableBeds}
                                    </p>

                                    <p>
                                        Occupied Beds:{" "}
                                        {ward.occupiedBeds}
                                    </p>

                                </div>
                            </div>

                        ))}

                    </div>

                )}

            </div>

            </main>
        </div>
    );
};

export default WardManagement;