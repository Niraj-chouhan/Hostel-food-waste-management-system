import { useAuth } from "../store/auth";

export const Service =()=>{
    const{services} = useAuth();
    return(
<section className="section-services">
    <div className="container">
        <div className="page-intro">
          <span className="eyebrow">Everything within reach</span>
          <h1>Hostel services, made simple.</h1>
          <p>Explore trusted services available for a more comfortable hostel experience.</p>
        </div>
    </div>
    <div className="container grid grid-three-cols">
        {services.length === 0 && <p className="empty-state">No services available.</p>}
        {
        services.map((curElem,index)=>{
                const {price,description,provider,service} = curElem;
                const serviceName = service || curElem.services;

                return(
                  <div className="card" key={curElem._id || index}>
            <div className="card-img">
                <img src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=870&auto=format&fit=crop" alt={serviceName} width="500" />
            </div>
            <div className="card-details">
                <div className="grid grid-two-cols">
                    <p>{provider}</p>
                    <p className="price-pill">{price}</p>
                </div>
                <h2>{serviceName}</h2>
                <p>{description}</p>
            </div>
        </div>
        );
            })}
    </div>
</section>
    );
};
