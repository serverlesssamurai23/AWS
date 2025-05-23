import React from 'react';

const ContactPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-2">
        We'd love to hear from you! Whether you have questions about our products, need help with an order, 
        or want to provide feedback, our team is here to assist.
      </p>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Customer Support</h2>
          <p>Email: support@opticart.example.com</p>
          <p>Phone: 1-800-OPTICART (1-800-678-4227)</p>
          <p>Hours: Monday - Friday, 9 AM - 6 PM (EST)</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Mailing Address</h2>
          <p>OptiCart Headquarters</p>
          <p>123 Vision Lane</p>
          <p>EyeCity, EC 45678</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Feedback</h2>
          <p>Have suggestions? Email us at feedback@opticart.example.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
