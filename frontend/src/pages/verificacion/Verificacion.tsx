import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import LoadingComponent from '../../components/LoadingComponent';
import { useAuth } from '../../components/AuthProvider';
import SendSVG from '../../assets/send.svg';
import { workers } from '../../functions/getWorkers';
import { useNavigate } from 'react-router-dom';


const Verificacion: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const { login } = useAuth();

    const [password, setPassword] = useState('');
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (password) {
            setIsSubmitable(true);
        } else {
            setIsSubmitable(false);
        }
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const worker = workers.find(w => w.index === id);
        const dni_ = `D${worker?.dni}`
        const password_ = password
        if (worker?.role === "admin") {
            setIsLoading(true)
            if (password_ + password_ === worker?.dni) {
                try {
                    await login(dni_, password_, worker?.role || "admin");
                    navigate("/admin")
                } catch (error) {
                    if (error instanceof DOMException && error.name === "NotAllowedError") {
                        console.warn("🚫 Autenticación cancelada por el usuario o no permitida.");
                        setErrorMessage("🚫 Autenticación cancelada por el usuario o no permitida.")
                    }
                    if (error instanceof Error && error.name === "Error") {
                        console.warn(error);
                        alert(error.message)
                        setErrorMessage(error.message)
                        console.log(errorMessage);
                    }
                } finally {
                    setIsLoading(false)
                }
            }
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            if (isSubmitable) {
                await login(dni_, password_, worker?.role || "worker");
                navigate("/asistencia")
                // window.location.reload();
            } else {
                alert("Complete el dni y contraseña")
            }

        } catch (error) {
            if (error instanceof DOMException && error.name === "NotAllowedError") {
                console.warn("🚫 Autenticación cancelada por el usuario o no permitida.");
                setErrorMessage("🚫 Autenticación cancelada por el usuario o no permitida.")
            }
            if (error instanceof Error && error.name === "Error") {
                console.warn(error);
                alert(error.message)
                setErrorMessage(error.message)
                console.log(errorMessage);
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className='component-container'>
            <div className='container'>
                <LoadingComponent flag={isLoading} />
                <form onSubmit={(e) => handleSubmit(e)} className='verificacion-form'>
                    <div className='form-item'>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            maxLength={8}
                            inputMode="numeric"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingRight: '2rem' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <div style={{
                        width: "100%",
                        marginTop: "1rem",
                        position: "relative",
                    }} >
                        <div style={{
                            position: "absolute",
                            backgroundColor: "#1a1a1a66",
                            width: "100%",
                            height: "100%",
                            borderRadius: "8px",
                            top: "0",
                            left: "0",
                        }} className={`${isSubmitable ? "hidden2" : ""}`} />
                        <button type="submit" className={`register-btn submit ${isSubmitable ? "green" : ""}`}>
                            <img src={SendSVG} alt=""></img>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verificacion;