// import FaceSVG from '../../assets/faceid.svg';
// import FingerSVG from '../../assets/fingerprint.svg';
import SendSVG from '../../assets/send.svg';
// import CameraSVG from '../../assets/camera.svg';
// import ClearSVG from '../../assets/clear.svg';
// import CheckSVG from '../../assets/check.svg';
// import Webcam from 'react-webcam';
// import BlockedCamera from '../../components/BlockedCamera';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';


// const web_base_url = import.meta.env.VITE_BASE_FRONTEND_URL
const base = import.meta.env.VITE_BASE_BACKEND_URL
const register_url = base + "/registerEndpoint"

const Registro: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitable, setIsSubmitable] = useState(false);
    // const [isFormCompleted, setIsFormCompleted] = useState(false);

    // Varibales para captura de foto
    // const webcamRef = useRef<any>(null);
    // const [isCameraOpen, setIsCameraOpen] = useState(false);
    // const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);

    // Variables para captura de huella
    // const [isFingerPrintCaptured, setIsFingerPrintCaptured] = useState(false);
    // const [fingerprintID, setFingerprintID] = useState<string | null>(null);

    // Variables de datos del formulario
    // const [photo, setPhoto] = useState<string | null>(null);
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    // const [isCameraAble, setIsCameraAble] = useState("");

    // useEffect(() => {
    //     const checkCameraPermission = async () => {
    //         try {
    //             const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
    //             if (permissions.state === 'granted') {
    //                 setIsCameraAble("granted")
    //             } else if (permissions.state === 'prompt') {
    //                 await navigator.mediaDevices.getUserMedia({ video: true });
    //             } else if (permissions.state === 'denied') {
    //                 setIsCameraAble("denied")
    //             }

    //             permissions.onchange = () => {
    //                 if (permissions.state === 'granted') {
    //                     setIsCameraAble("granted");
    //                 } else {
    //                     setIsCameraAble('denied');
    //                 }
    //                 setIsPhotoCaptured(false);
    //                 setPhoto(null);
    //             };
    //         } catch (error) {
    //             console.error('⚠️ Error al verificar permiso de cámara:', error);
    //         }
    //     };

    //     checkCameraPermission();
    // }, []);

    // useEffect(() => {
    //     if (isFormCompleted) {
    //         if (isPhotoCaptured || isFingerPrintCaptured) {
    //             setIsSubmitable(true);
    //         } else {
    //             setIsSubmitable(false);
    //         }
    //     } else {
    //         setIsSubmitable(false);
    //     }
    // }, [isPhotoCaptured, isFingerPrintCaptured, isFormCompleted]);

    useEffect(() => {
        if (dni.length >= 8 && nombre.length > 0 && password) {
            // setIsFormCompleted(true);
            setIsSubmitable(true);
        } else {
            // setIsFormCompleted(false);
            setIsSubmitable(false);
        }
    }, [dni, nombre, password]);

    // useEffect(() => {
    //     if (fingerprintID) {
    //         setIsFingerPrintCaptured(true);
    //     } else {
    //         setIsFingerPrintCaptured(false);
    //     }
    // }, [fingerprintID]);


    const resetValues = () => {
        // setIsFormCompleted(false);
        // setIsCameraOpen(false);
        // setIsPhotoCaptured(false);
        // setIsFingerPrintCaptured(false);
        // setFingerprintID(null);
        // setPhoto(null);
        setIsSubmitable(false);
        setDni('');
        setNombre('');
    }

    // const displayCamera = () => {
    //     setIsCameraOpen(true);
    // }

    // const closeCamera = () => {
    //     setIsCameraOpen(false);
    // }

    // const clearPhoto = () => {
    //     setIsPhotoCaptured(false);
    //     setPhoto(null);
    // }

    // const capturePhoto = () => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     if (imageSrc) {
    //         setPhoto(imageSrc);
    //         setIsPhotoCaptured(true);
    //     }
    // };

    // const strToUint8Array = (str: string) => new TextEncoder().encode(str);

    // const captureFingerPrint = async () => {
    //     try {
    //         const challenge = crypto.getRandomValues(new Uint8Array(32));
    //         const isLaptop = window.innerWidth > 768;
    //         const publicKey: PublicKeyCredentialCreationOptions = {
    //             challenge,
    //             rp: { name: web_base_url, "id": web_base_url },
    //             user: {
    //                 id: strToUint8Array(dni),
    //                 name: nombre,
    //                 displayName: nombre
    //             },
    //             pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    //             authenticatorSelection: {
    //                 authenticatorAttachment: isLaptop ? 'cross-platform' : 'platform',
    //                 residentKey: "required",
    //                 userVerification: 'required'
    //             },
    //             timeout: 60000,
    //             attestation: 'none'
    //         };
    //         const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
    //         if (credential) {
    //             setFingerprintID(credential.id)
    //             setIsFingerPrintCaptured(true)
    //         } else {
    //             setFingerprintID(null)
    //             setIsFingerPrintCaptured(false)
    //         }
    //     } catch (err) {
    //         setIsFingerPrintCaptured(false)
    //         setFingerprintID(null)
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch(register_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "nombre": nombre,
                    "dni": `D${dni}`,
                    "password": password,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                resetValues();
                return
            }
            alert(data.message);
            navigate('/');

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar el usuario. Intenta nuevamente.');
        } finally {
            setIsLoading(false)
        };
    };

    // const cameraDisplayLayer = () => {
    //     return (
    //         <div className={`registro-webcam-container ${!isCameraOpen ? "hidden" : ""}`} onClick={closeCamera}>
    //             <div style={{
    //                 width: "100%",
    //                 maxWidth: "350px",
    //                 margin: "0 auto",
    //             }}>
    //                 <Webcam
    //                     audio={false}
    //                     ref={webcamRef}
    //                     screenshotFormat="image/jpeg"
    //                     width="100%"
    //                     style={{
    //                         borderRadius: "50%",
    //                         objectFit: "cover",
    //                         aspectRatio: "3 / 4",
    //                         transform: "scaleX(-1)"

    //                     }}
    //                     videoConstraints={{
    //                         facingMode: 'user',
    //                         width: 640,
    //                         height: 480,
    //                     }}
    //                     className={`${isPhotoCaptured ? "hidden" : ""}`}
    //                     onClick={(e) => e.stopPropagation()}
    //                 />
    //                 <div className={`${!isPhotoCaptured ? "hidden" : ""}`}>
    //                     <img src={photo!} alt="Foto Capturada" style={{
    //                         width: "100%",
    //                         objectFit: "cover",
    //                         borderRadius: "50%",
    //                         aspectRatio: "3 / 4",
    //                         transform: "scaleX(-1)"
    //                     }} />
    //                 </div>
    //             </div>
    //             <div style={{
    //                 display: "flex",
    //                 flexDirection: "column",
    //                 height: "120px",
    //                 alignItems: "center",
    //                 justifyContent: "flex-start",
    //                 gap: "10px",
    //             }}>
    //                 <button type='button'
    //                     disabled={isPhotoCaptured}
    //                     className={`${isPhotoCaptured ? "hidden" : ""}`}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         capturePhoto();
    //                     }}>
    //                     <img src={CameraSVG} alt=""></img>
    //                 </button>
    //                 <button type='button'
    //                     className={`${!isPhotoCaptured ? "hidden" : ""}`}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         closeCamera();
    //                     }}>
    //                     <img src={CheckSVG} alt=""></img>
    //                 </button>
    //                 <button type='button'
    //                     className={`${!isPhotoCaptured ? "hidden" : ""}`}
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         clearPhoto();
    //                     }}>
    //                     <img src={ClearSVG} alt=""></img>
    //                 </button>
    //             </div>
    //         </div>
    //     )
    // }


    return (
        <div className='component-container'>
            <LoadingComponent flag={isLoading} />
            {/* {
                false && (
                    <BlockedCamera flag={isCameraAble} />
                )
            } */}
            <div className='registro'>
                {/* {false && cameraDisplayLayer()} */}
                <form onSubmit={(e) => handleSubmit(e)} style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    alignItems: "center"
                }}>

                    <div className='form-item'>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={{}}
                        />
                    </div>
                    <div className='form-item'>
                        <label htmlFor="dni">DNI</label>
                        <input
                            type="text"
                            minLength={8}
                            maxLength={8}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            id="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-item'>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingRight: '2rem'}}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {/* {false && (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: "1rem",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    backgroundColor: "#1a1a1a66",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "8px",
                                    top: "0",
                                    left: "0",
                                }}
                                className={`${isFormCompleted ? "hidden" : ""}`}
                            />
                            <button
                                type='button'
                                disabled={isFingerPrintCaptured}
                                className={`register-btn ${isFingerPrintCaptured ? "green" : ""}`}
                                onClick={captureFingerPrint}
                            >
                                <img src={FingerSVG} alt="Fingerprint Icon"></img>
                            </button>
                            <button
                                type='button'
                                className={`register-btn ${isPhotoCaptured ? "green" : ""}`}
                                onClick={displayCamera}
                            >
                                <img src={FaceSVG} alt=""></img>
                            </button>
                        </div>
                    )} */}
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
            </div>
        </div >
    );
};

export default Registro;