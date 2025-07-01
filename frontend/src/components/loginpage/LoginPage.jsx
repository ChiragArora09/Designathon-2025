import loginImage from "../../assets/loginpage-image.png"
import "./LoginPage.css"
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

const LoginPage = () => {
    const [backendError, setBackendError] = useState("");
    const { register, handleSubmit, formState:{errors} } = useForm();
    const navigate = useNavigate()
    const { login, loading, isLoggedIn, role } = useAuth();

    useEffect(() => {
    if (!loading && isLoggedIn) {
        navigate(role === "Admin" ? "/admin-dashboard" : "/maverick-dashboard" ); // ns4o3s7nh@
    }
    }, [isLoggedIn, role, loading, navigate]);

    const onSubmit = async(data) => {
        setBackendError("");
        try{
            const response = await axios.post("http://localhost:3000/api/login", {
                username: data.username,
                password: data.password,
            });

            const { username, role } = response.data.user
            login({username, role});

            if (role === "Admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/maverick-dashboard");
            }

            console.log("Response:", response.data);
        } catch(error) {
            if (error.response && error.response.data && error.response.data.message) {
                setBackendError(error.response.data.message);
            } else {
                setBackendError("Something went wrong. Please try again.");
            }
            console.error("Login error:", error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Left Image Section */}
                <div className="login-left">
                    <img src={loginImage} alt="Login Illustration" className="login-image" />
                    <p className="login-quote">
                        “Because learning should feel awesome.”<br />
                        {/* <span>– Srikrishna Ramakarthikeyan, CEO & Executive Director</span> */}
                    </p>
                </div>

                {/* Right Form Section */}
                <div className="login-right">
                    <div className="login-title">MaveriQ</div>
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Username" {...register("username", {required: "username is required"})} />
                        {errors.username && (
                            <p className="error-msg">{errors.username.message}</p>
                        )}
                        <input type="password" placeholder="Password" {...register("password", {required: "password is required"})} />
                        {errors.password && (
                            <p className="error-msg">{errors.password.message}</p>
                        )}
                        <div className="login-options">
                            <label><input type="checkbox"/>Remember me</label>
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    {backendError && <p className="backend-error">{backendError}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
