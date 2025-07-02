import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';
import { workers } from '../../functions/getWorkers'
import DescansoPopup from './popups/DescansoPopup';
import LoadingComponent from '../../components/LoadingComponent';

const base = import.meta.env.VITE_BASE_BACKEND_URL
const decrypt_token_url = base + "/decryptData"

interface AdminData {
    name?: string,
}

const notAdminWorkers = workers.filter(w => w.role === "worker");

const Admin: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [abrirPopupDescanso, setAbrirPopupDescanso] = useState<boolean>(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [adminData, setAdminData] = useState<AdminData>();

    useEffect(() => {
        const verifyToken = async (jwt: string) => {
            try {
                setIsLoading(true);
                const response = await fetch(decrypt_token_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "token": jwt
                    }),
                });
                const responseData = await response.json();
                const admData: AdminData = {
                    name: responseData.content.nombre
                }
                setAdminData(admData)

                if (!response.ok) {
                    const error_message = responseData.content.message ?? ""
                    console.log("Respuesta del servidor:", error_message);
                    sessionStorage.removeItem("authToken")
                    alert(error_message)
                    navigate(`/`)
                    return
                }

            } catch (error) {
                console.error("Error al verificar el token", error);
                navigate(`/`);
            } finally {
                setIsLoading(false);
            }
        }

        const jwt = sessionStorage.getItem('authToken');
        if (jwt) {
            verifyToken(jwt)
        } else {
            navigate(`/`);
        }
    }, [])

    return (
        <div style={{ width: "80vw", maxWidth: "400px" }}>
            <LoadingComponent flag={isLoading} />
            <div
                className='container'
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                    margin: "auto",
                }}
            >
                <h1 style={{ fontSize: "32px" }}>{adminData?.name}</h1>
                <button className="check-assistance-btn entrada"
                    onClick={() => setAbrirPopupDescanso(true)}>
                    Asignar descansos
                </button>
                <button className="check-assistance-btn salir" onClick={() => {
                    logout()
                }}>Salir</button>

            </div>
            {abrirPopupDescanso && (
                <DescansoPopup
                    workers={notAdminWorkers}
                    onClose={() => setAbrirPopupDescanso(false)}
                />
            )}
        </div>
    );
};

export default Admin;