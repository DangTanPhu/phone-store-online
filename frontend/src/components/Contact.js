import React from "react";
import "./Contact.module.css";

const ContactBook = () => {
  return (
    <div className="contact-book">
      {/* Left Section - Contact Info */}
      <div className="contact-info">
        <h2 className="contact-header">Contact Information</h2>
        <ul className="contact-details">
          <li><strong>Address:</strong> 123 Street Name, City, Country</li>
          <li><strong>Email:</strong> contact@example.com</li>
          <li><strong>Phone:</strong> +123 456 789</li>
          <li><strong>Websites:</strong> www.example.com</li>
        </ul>
        <div className="social-media">
          <h3>Find us on Social Media</h3>
          <div className="icons">
            <a href="#" className="icon youtube">YouTube</a>
            <a href="#" className="icon facebook">Facebook</a>
            <a href="#" className="icon twitter">Twitter</a>
          </div>
        </div>
      </div>

      {/* Right Section - Contact Form */}
      <div className="contact-form">
        <h2 className="form-header">Contact Form</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="Enter subject" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Enter your message"></textarea>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactBook;
