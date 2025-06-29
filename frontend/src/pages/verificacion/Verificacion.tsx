import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import LoadingComponent from '../../components/LoadingComponent';
import { useAuth } from '../../components/AuthProvider';
import SendSVG from '../../assets/send.svg';
import { workers } from '../../functions/getWorkers';
import { useNavigate } from 'react-router-dom';

const not_admins = workers.map((w) => {
    return w.dni
})

const Verificacion: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const { login } = useAuth();

    const [dniNumber, setDniNumber] = useState<string>('');
    const [password, setPassword] = useState('');
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (id) {
            const numericId = Number(id) - 1;
            if (numericId >= 0) {
                setDniNumber(workers[numericId].dni);
            }
        }
    }, [id]);

    useEffect(() => {
        if (password) {
            setIsSubmitable(true);
        } else {
            setIsSubmitable(false);
        }
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id?.toLocaleLowerCase() === "admin" && not_admins.includes(dniNumber)) {
            alert("No es administrador")
            navigate(`/`)
            return
        }

        const dni_ = `D${dniNumber}`
        const password_ = password

        try {
            setIsLoading(true)

            if (isSubmitable) {
                await login(dni_, password_);
                window.location.reload();
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
            <LoadingComponent flag={isLoading} />
            <form onSubmit={(e) => handleSubmit(e)} style={{
                width: "100%",
                height: "500px",
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                margin: "auto"
            }}>
                {
                    id?.toLocaleLowerCase() === "admin" && (
                        <div className='form-item'>
                            <label htmlFor="dni">DNI</label>
                            <input
                                type="text"
                                minLength={8}
                                maxLength={8}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                id="dni"
                                value={dniNumber}
                                onChange={(e) => setDniNumber(e.target.value)}
                                required
                            />
                        </div>
                    )
                }
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
                    }} className={`${isSubmitable ? "hidden" : ""}`} />
                    <button type="submit" className={`register-btn submit ${isSubmitable ? "green" : ""}`}>
                        <img src={SendSVG} alt=""></img>
                    </button>
                </div>
            </form>
            {/* {
                false && (
                    <div className='verificacion'>
                        <button onClick={handleSubmit}>
                            <img src={FingerSVG} alt="Fingerprint Icon"></img>
                        </button>
                        <button onClick={() => navigate('/verificacion/f')}>
                            <img src={FaceSVG} alt="Face ID Icon"></img>
                        </button>

                    </div>
                )
            } */}
        </div>
    );
};

export default Verificacion;