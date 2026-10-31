
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./auth.css";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mobile =
        location.state?.mobile ||
        sessionStorage.getItem("passwordResetMobile") ||
        "";

    const demoOtp = location.state?.demoOtp || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[0-9]{6}$/.test(otp)) {
            setError("Enter the 6-digit OTP.");
            return;
        }

        if (!mobile) {
            setError("Mobile number is missing. Please start again.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/verify-otp", {
                mobile,
                otp
            });

            navigate("/reset-password", {
                state: {
                    mobile,
                    resetToken: response.data.resetToken
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Hospital Management System</h1>
                <h2>Verify OTP</h2>

                <p>
                    Enter the OTP for mobile number ending in{" "}
                    {mobile ? mobile.slice(-4) : "----"}.
                </p>

                {demoOtp && (
                    <p>
                        Demo OTP: <strong>{demoOtp}</strong>
                    </p>
                )}

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleVerify}>
                    <div className="form-group">
                        <label>Six-digit OTP</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading || !mobile}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="auth-links">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Request New OTP
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
