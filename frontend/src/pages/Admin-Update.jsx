import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useAuth } from "../store/auth";
import{toast} from "react-toastify"
import { API_ENDPOINTS } from "../config/api";
export const AdminUpdate = () => {

    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
        role: "student",
    });

    //  get id URL 

    const params = useParams();
    const { authorizationToken } = useAuth();
    // getsingleUserData function

    const getsingleUserData = useCallback(async () => {
        try {
            if (!authorizationToken) return;

            const response = await fetch(API_ENDPOINTS.adminUser(params.id), {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            const data = await response.json();
            console.log(`users single data ${data}`);
           if (response.ok && data) {
             setData(data);
           }


        } catch (error) {
            console.log(error);
        }

    }, [authorizationToken, params.id]);


    useEffect(() => {
        const fetchSingleUser = async () => {
            await getsingleUserData();
        };

        fetchSingleUser();
    }, [getsingleUserData]);

    //   handle input for dynamicly update present value

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
         
         setData({
            ...data,                        //spreate oprator for rewrite data
            [name]:value,
         });
    };
 
    const handlesubmit = async (e) => {
  e.preventDefault();
    
      try {
            const response = await fetch(API_ENDPOINTS.adminUserUpdate(params.id),
                {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body:JSON.stringify(data),
      }
          );
      if(response.ok){ 
        toast.success("update successfully");
      }
      else{
        toast.error("Not update");

      }
      } catch (error) {
        console.log(error);
      }
   
    }
    
    return <>
        <section className="section-from">
            <form onSubmit={handlesubmit}>
            <div>
                <h1>Update user data </h1>
            </div>
                <div>
                    <label htmlFor="username">username</label>

                    <input type="text"
                        name="username"
                        placeholder="enter your name"
                        id="username"
                        required
                        autoComplete="off"
                        value={data.username}
                        onChange={handleInput}
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="email">email</label>

                    <input type="email"
                        name="email"
                        placeholder="enter your email"
                        id="phone"
                        required
                        autoComplete="off"
                        value={data.email}
                        onChange={handleInput}

                    />
                </div>
                <br />
                <div>
                    <label htmlFor="phone">phone</label>

                    <input type="phone"
                        name="phone"
                        placeholder="enter your phone"
                        id="email"
                        required
                        autoComplete="off"
                        value={data.phone}
                        onChange={handleInput}

                    />
                </div>
                <br />
                <div>
                    <label htmlFor="role">Account role</label>
                    <select
                        name="role"
                        id="role"
                        value={data.isAdmin ? "admin" : (data.role || "student")}
                        onChange={handleInput}
                        disabled={data.isAdmin}
                    >
                        <option value="student">Student</option>
                        <option value="cook">Hostel Cook</option>
                        {data.isAdmin && <option value="admin">Administrator</option>}
                    </select>
                </div>
                <br />
                <button type="submit" className="btn btn-submite" >Update</button>
            </form>
        </section>
    </>
}
