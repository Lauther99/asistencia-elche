import React from "react";
import { Workers } from '../../../functions/getWorkers'
import CalendarSVG from '../../../assets/calendar.svg';
import Calendar from "../../../components/Calendar";
import LoadingComponent from "../../../components/LoadingComponent";

const base = import.meta.env.VITE_BASE_BACKEND_URL
const update_descansos_url = base + "/updateDescansos"

type Props = {
    workers: Workers[];
    onClose: () => void;
};

type ToastProperties = {
    toastClassname: string;
    message: string;
};

const DescansoPopup: React.FC<Props> = ({ workers, onClose }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = React.useState<string>("");
    const selectedWorker = workers.find(w => w.dni === selectedWorkerId);
    const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
    const [showToast, setShowToast] = React.useState(false);
    const [toastProperties, setToastProperties] = React.useState<ToastProperties>({message: "", toastClassname: ""});


    const onDateSelect = (day: Date) => {
        setSelectedDay(day)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            const formatted = selectedDay?.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            const response = await fetch(update_descansos_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "dni": `D${selectedWorker?.dni}`,
                    "nombre": selectedWorker?.nombre,
                    "fecha": formatted
                }),
            });
            const responseData = await response.json();

            if (response.ok) {
                setToastProperties({
                    message: "✅ Descanso guardado correctamente",
                    toastClassname: "toast-success"
                })
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
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
            console.error(error)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className="popup-overlay">
            <LoadingComponent flag={isLoading} />
            <div className="popup-descanso-container">
                <div className="header-row">
                    <button
                        onClick={onClose}
                        className="close"
                    >
                        X
                    </button>
                    <h2 className="title-text">
                        ¿A quién vas a asignar descanso?
                    </h2>
                </div>

                <div className="mb-4">
                    <label htmlFor="worker-select" className="label-text">
                        Seleccionar trabajador:
                    </label>
                    <select
                        id="worker-select"
                        className="custom-select "
                        value={selectedWorkerId}
                        onChange={e => setSelectedWorkerId(e.target.value)}
                    >
                        <option value="">-- Selecciona uno --</option>
                        {workers.map(worker => (
                            <option key={worker.dni} value={worker.dni}>
                                {worker.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Info del trabajador */}
                {selectedWorker && (
                    <div className="worker-info-box">
                        <p><strong>Nombre:</strong> {selectedWorker.nombre}</p>
                        <p><strong>DNI:</strong> {selectedWorker.dni}</p>
                        <div
                            className="worker-calendar"
                        >
                            <img src={CalendarSVG} alt=""></img>
                            <span className="worker-calendar-text">Seleccionar día en el calendario</span>
                        </div>

                        <Calendar onDateSelect={onDateSelect} />

                        <button type="submit" className="" style={{ marginTop: "24px" }}
                            onClick={handleSubmit}>
                            Guardar
                        </button>
                    </div>

                )}
                {showToast && (
                    <div className={`toast ${toastProperties.toastClassname}`}>
                        {toastProperties.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DescansoPopup;
