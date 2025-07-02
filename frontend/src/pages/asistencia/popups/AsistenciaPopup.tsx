import React from "react";
import LoadingComponent from "../../../components/LoadingComponent";

interface IWorker {
    nombre: string,
    dni: string,
}

interface AsistenciaPopupProps {
    workerInfo: IWorker;
    onClose: () => void;
};

type ToastProperties = {
    toastClassname: string;
    message: string;
};

const base = import.meta.env.VITE_BASE_BACKEND_URL
const update_observaciones_url = base + "/updateObservaciones"


const AsistenciaPopup: React.FC<AsistenciaPopupProps> = ({ workerInfo, onClose }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [message, setMessage] = React.useState("");
    const [showToast, setShowToast] = React.useState(false);
    const [toastProperties, setToastProperties] = React.useState<ToastProperties>({ message: "", toastClassname: "" });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            const now = new Date();
            const formatted = now?.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            const payload = {
                "dni": workerInfo?.dni,
                "nombre": workerInfo?.nombre,
                "fecha": formatted,
                "observacion": message
            }

            const response = await fetch(update_observaciones_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();

            if (response.ok) {
                setToastProperties({
                    message: "✅ Notificación enviada",
                    toastClassname: "toast-success"
                })
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false)
                    onClose()
                }, 2000);
            }
            if (!response.ok) {
                const error_message = responseData.message ?? ""
                setToastProperties({
                    message: error_message,
                    toastClassname: "toast-error"
                })
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                console.error("Respuesta del servidor:", error_message);
            }

        } catch (error) {
            setToastProperties({
                message: error?.toString() || "",
                toastClassname: "toast-error"
            })
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            console.error("Error:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="popup-overlay">
            <LoadingComponent flag={isLoading} />
            <div className="notification-popup">
                <div className="header-row notification-header">
                    <button className="close" onClick={onClose}>×</button>
                    <h2 className="title-text">📬 Buzón de Notificaciones</h2>
                </div>

                <div className="notification-body">
                    <textarea
                        id="notification-message"
                        className="notification-textarea"
                        placeholder="Escribe tu mensaje aquí..."
                        value={message}
                        onChange={handleChange}
                    ></textarea>
                    <button
                        className=""
                        disabled={message.trim() === ""}
                        onClick={handleSubmit}
                    >
                        Enviar
                    </button>
                </div>
                {showToast && (
                    <div className={`toast ${toastProperties.toastClassname}`}>
                        {toastProperties.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AsistenciaPopup;
