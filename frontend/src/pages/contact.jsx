import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
// import { use } from "react";


// this part use for send contact form details fronted to backend

const defaultContactFormData ={
        username:"",
        email:"",
        message:"",
    };


export const Contact =()=>{
    const[contact,setContact] = useState(defaultContactFormData);
    // const[contact,setContact] = useState({
    //     username:"",
    //     email:"",
    //     message:"",
    // });
    const [userData,setUserData] = useState(true);
 
    const {user} = useAuth();

    useEffect(() => {
        if (userData && user) {
            const timerId = setTimeout(() => {
                setContact({
                    username: user.username || "",
                    email: user.email || "",
                    message: "",
                });
                setUserData(false);
            }, 0);

            return () => clearTimeout(timerId);
        }
    }, [user, userData]);

  const  handleInput = (e) =>{
let name = e.target.name;
let value = e.target.value;
  
         setContact({
           ...contact,
           [name]:value,
         });
  }
  
const handleSubmit = async (e)=>{
e.preventDefault();
  
   //  send data backend to frontend 
// we use try & catch for catch error
try {
    const response = await fetch(API_ENDPOINTS.contact,{
        method:"POST",
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify(contact), 
    });
    if(response.ok){
        setContact(defaultContactFormData);
        const data = await response.json();
        console.log(data);
        toast.success("Message sent successfully");
    }
} catch (error) {
  toast.error("Message could not be sent");
  console.log(error);
      
}

};
    return<>
                    <section className="contact-page">
                      <div className="container contact-layout">
                        <div className="contact-copy">
                          <span className="eyebrow">We are here to help</span>
                          <h1>Let&apos;s solve it together.</h1>
                          <p>Share your question, feedback or hostel concern. The management team will review your message.</p>
                          <div className="contact-detail"><span>@</span><div><strong>Email support</strong><p>Reply through your registered email</p></div></div>
                          <div className="contact-detail"><span>✓</span><div><strong>Tracked requests</strong><p>Your message reaches the admin dashboard</p></div></div>
                        </div>
                      <form className="contact-form" onSubmit={handleSubmit}>
                             <div className="head">
                                <span>Send a message</span>
                                <h2>How can we help?</h2>
                             </div>
                             <div>
                                <label htmlFor="username">username</label>

                                <input type="text"
                                    name="username"
                                    placeholder="enter your name"
                                    id="username"
                                    required
                                    autoComplete="off"
                                    value={contact.username}
                                    onChange={handleInput}
                                />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="email">email</label>

                                <input type="email"
                                    name="email"
                                    placeholder="enter your email"
                                    id="email"
                                    required
                                    autoComplete="off"
                                       value={contact.email}
                                    onChange={handleInput}

                                />
                            </div>
                            <br />
                                <div>
                                <label htmlFor="message">message</label>
                                <textarea type="message"
                                    name="message"
                                    placeholder="enter your phone message"
                                    id="message"
                                    required
                                    autoComplete="off"
                                       value={contact.message}
                                    onChange={handleInput}
                                ></textarea>
                            </div>
                            <br />
                            <button type="submit" className="btn btn-submite" >Send message</button>
                        </form>
                      </div>
                    </section>

    </>

};
