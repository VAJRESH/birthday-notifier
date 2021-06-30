import React from "react";

const ServiceCard = ({ icon, service }) => {
  return (
    <>
      <section className="service-card">
        <div>{icon}</div>
        <h3>{service}</h3>
      </section>
    </>
  );
};

export default ServiceCard;
