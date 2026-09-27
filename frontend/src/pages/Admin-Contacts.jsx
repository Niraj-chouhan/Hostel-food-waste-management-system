import { useCallback, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useState } from "react";
import { API_ENDPOINTS, parseListResponse } from "../config/api";

export const AdminContacts = () => {
 
    const [ContactData,setContactData] = useState([]);
    const [message, setMessage] = useState("Loading contacts...");

    const { authorizationToken } = useAuth();

    const getContactsData = useCallback(async () => {

        try {
            if (!authorizationToken) return;

            const response = await fetch(API_ENDPOINTS.adminContacts, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            const data = await response.json();
            console.log("contact data: ", data );
            if (response.ok) {
                const contacts = parseListResponse(data);
                setContactData(contacts);
                setMessage(contacts.length === 0 ? "No contacts available." : "");
            } else {
                setContactData([]);
                setMessage(data.message || "Unable to load contacts.");
            }

        } catch (error) {
            console.log(error);
            setMessage("Unable to load contacts.");
        }
 
    }, [authorizationToken]);

    const deleteContact = async (id) => {
        try {
            const response = await fetch(API_ENDPOINTS.adminContactDelete(id), {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (response.ok) {
                setContactData((prevContacts) =>
                    prevContacts.filter((contact) => contact._id !== id)
                );
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const fetchContacts = async () => {
            await getContactsData();
        };

        fetchContacts();
    }, [getContactsData]);

    return <>
       <section className="admin-users-section">
                <div className="container">
                    <div className="admin-page-heading"><div><span className="eyebrow">Student support</span><h1>Contact inbox</h1><p>Messages and requests received from residents.</p></div><span className="count-pill">{ContactData.length} messages</span></div>
                </div>
                <div className="container admin-users">
                            {message && <p className="empty-state">{message}</p>}
                            { ContactData.map((curContactData, index) => {
                                const { _id, username,email,message} = curContactData;
                                return(
                                <div key={_id || index}>
                                    <span className="message-avatar">{username?.charAt(0)?.toUpperCase()}</span>
                                    <p>{username}</p>
                                    <p>{email}</p>
                                    <p>{message}</p>
                                    <button className="delete-btn" onClick={() => deleteContact(_id)}>Delete</button>
                                </div>
                                );
  })}

                </div>
            </section>
</>
};
