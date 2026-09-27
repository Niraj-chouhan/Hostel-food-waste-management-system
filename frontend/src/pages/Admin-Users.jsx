import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import {Link} from "react-router-dom";
import { API_ENDPOINTS, parseListResponse } from "../config/api";

export const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("Loading users...");

    const { authorizationToken } = useAuth();
    console.log("authorizationToken:", authorizationToken);
    const getAllUserData = useCallback(async () => {
        try {
            if (!authorizationToken) return;
            // check token
            console.log("Token sent:", authorizationToken);

            const response = await fetch(API_ENDPOINTS.adminUsers, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();
            if (response.ok) {
                const userList = parseListResponse(data);
                setUsers(userList);
                setMessage(userList.length === 0 ? "No users available." : "");
            } else {
                setUsers([]);
                setMessage(data.message || "Unable to load users.");
            }

        } catch (error) {
            console.log(error);
            setMessage("Unable to load users.");
        }
    }, [authorizationToken]);


    // delete the user on delete butto
    const deleteUser = async (id) =>{
     try {
            const response = await fetch(API_ENDPOINTS.adminUserDelete(id), {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });

               const data = await response.json();
                console.log(`users after delete ${data}`);

                //problem after deletion no need to refresh page
       
                if(response.ok){
                    getAllUserData();
                }


       } catch (error) {
          console.log(error);
     }
    
            };
    


    useEffect(() => {
        const fetchUsers = async () => {
            await getAllUserData();
        };

        fetchUsers();
    }, [getAllUserData]);

    // useEffect(() => {

    //     if (!authorizationToken) return;

    //     getAllUserData();

    // }, [authorizationToken]);

    return (
        <>
            <section className="admin-users-section">
                <div className="container">
                    <div className="admin-page-heading"><div><span className="eyebrow">Account management</span><h1>Registered users</h1><p>Review and maintain resident account details.</p></div><span className="count-pill">{users.length} users</span></div>
                </div>
                <div className="container admin-users">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Update</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                             <tbody>
                            { users.map((curUser, index) => (
                                <tr key={index}>
                                    <td>{curUser.username}</td>
                                    <td>{curUser.email}</td>
                                    <td>{curUser.phone}</td>
                                    <td>
                                        <Link className="edit-btn" to={`/admin/users/${curUser._id}/edit`}>Edit</Link>
                                    </td>
                                    <td><button className="delete-btn" onClick={()=> deleteUser(curUser._id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {message && <p className="empty-state">{message}</p>}
                </div>
            </section>
        </>
    );
};

