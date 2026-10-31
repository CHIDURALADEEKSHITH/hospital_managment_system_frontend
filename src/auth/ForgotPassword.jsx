
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./auth.css";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [demoOtp, setDemoOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setDemoOtp("");

        if (!/^[0-9]{10}$/.test(mobile.trim())) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/forgot-password",
                { mobile: mobile.trim() }
            );

            setMessage(
                response.data.message ||
                "If an account exists, an OTP has been generated."
            );

            if (response.data.demoMode && response.data.demoOtp) {
                setDemoOtp(response.data.demoOtp);
            }

            sessionStorage.setItem(
                "passwordResetMobile",
                mobile.trim()
            );

            navigate("/verify-otp", {
                state: {
                    mobile: mobile.trim(),
                    message: response.data.message,
                    demoOtp:
                        response.data.demoMode
                            ? response.data.demoOtp
                            : null
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to request OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Hospital Management System</h1>
                <h2>Forgot Password</h2>

                <p>
                    Enter your registered mobile number to
                    receive a password-reset OTP.
                </p>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {message && <p>{message}</p>}

                {demoOtp && (
                    <p>
                        Demo OTP: <strong>{demoOtp}</strong>
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Registered Mobile Number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(e) =>
                                setMobile(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Requesting OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="auth-links">
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

export default ForgotPassword;
