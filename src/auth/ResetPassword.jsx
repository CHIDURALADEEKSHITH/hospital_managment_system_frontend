
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./auth.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mobile =
        location.state?.mobile ||
        sessionStorage.getItem("passwordResetMobile") ||
        "";

    const resetToken = location.state?.resetToken || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!mobile || !resetToken) {
            setError(
                "Your password-reset session is missing or expired. Please verify your OTP again."
            );
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/reset-password",
                {
                    mobile,
                    resetToken,
                    newPassword
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successfully."
            );

            sessionStorage.removeItem("passwordResetMobile");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset password. Please verify your OTP again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Hospital Management System</h1>
                <h2>Reset Password</h2>

                <p>
                    Create a new password for the account ending in{" "}
                    {mobile ? mobile.slice(-4) : "----"}.
                </p>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {message && <p>{message}</p>}

                <form onSubmit={handleReset}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading || !mobile || !resetToken}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div className="auth-links">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Start Again
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

export default ResetPassword;
