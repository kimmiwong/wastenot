import { useForm, ValidationError } from '@formspree/react';
import contact from "../assets/Contact.png";

function ContactForm() {
  const [state, handleSubmit] = useForm("xldlpjwl");

  if (state.succeeded) {
    return <p>Message sent!</p>;
  }

  return (
    <div className="contact-page">
      {/* Banner at the top */}
      <div className="contact-banner">
        <img src={contact} alt="Contact Us" />
      </div>

      {/* Form directly under the banner */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Your Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="message">Your Message</label>
        <textarea id="message" name="message" required />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        <button type="submit" disabled={state.submitting}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
