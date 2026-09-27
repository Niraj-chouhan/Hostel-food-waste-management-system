import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { API_ENDPOINTS, parseListResponse } from "../config/api";

export const AdminService = () =>{
    const [services, setServices] = useState([]);
    const [message, setMessage] = useState("Loading services...");
    const { authorizationToken } = useAuth();

    const getServices = useCallback(async () => {
        try {
            if (!authorizationToken) return;

            const response = await fetch(API_ENDPOINTS.adminServices, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();

            if (response.ok) {
                const serviceList = parseListResponse(data);
                setServices(serviceList);
                setMessage(serviceList.length === 0 ? "No services available." : "");
            } else {
                setServices([]);
                setMessage(data.message || "Unable to load services.");
            }
        } catch (error) {
            console.log(error);
            setMessage("Unable to load services.");
        }
    }, [authorizationToken]);

    useEffect(() => {
        const fetchServices = async () => {
            await getServices();
        };

        fetchServices();
    }, [getServices]);

    return (
        <section className="admin-users-section">
            <div className="container">
                <div className="admin-page-heading"><div><span className="eyebrow">Service catalog</span><h1>Hostel services</h1><p>Review services visible to every resident.</p></div><span className="count-pill">{services.length} services</span></div>
            </div>
            <div className="container admin-users">
                {message && <p className="empty-state">{message}</p>}
                {services.map((curService) => (
                    <div key={curService._id}>
                        <p>{curService.service}</p>
                        <p>{curService.provider}</p>
                        <p>{curService.price}</p>
                        <p>{curService.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
