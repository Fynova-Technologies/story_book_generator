import { useState } from "react";
const ContactBgImg = "/assets/images/contactbg.png";
const CONTACT_EMAIL = "contact@fynovatech.com";
import InputField from "../components/InputField/Input";
import {useForm} from "react-hook-form"
import Navbar from "../components/Navbar/Navbar";

const ContactUsSection = () => {
    type FormData = {
      name: string;
      email:string;
      message:string;
    };
  const {register,handleSubmit,formState:{errors}}= useForm<FormData>();
  const [sent, setSent] = useState(false);
  // ponytail: no backend for messages yet, so open the visitor's mail app; a `contact` Edge Function can replace this.
  const handleSend = (data: FormData) => {
    const subject = encodeURIComponent(`Message from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };


  return (
    <div>
      {/* ── MAIN CONTENT ── */}
      <section
        className="w-full pt-24 md:pt-28 pb-10 px-4 sm:px-10 lg:px-20"
      >
        <Navbar bglight ={true}/>
        <div className="max-w-7xl mx-auto">

          {/* ── TOP BADGE ── */}
          <div className="flex justify-center mb-6">
            <span className="font-body px-8 py-2 rounded-full text-base font-semibold text-black bg-white">
              Contact Us
            </span>
          </div>

          {/* ── HEADING ── */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-center text-light-text mb-10">
            Have questions? Ready to help!
          </h1>

          {/* ── MAIN CARD ── */}
          <div className="flex p-4 md:p-10 gap-8 lg:gap-20 flex-col lg:flex-row rounded-[36px] overflow-hidden bg-light-panel">

            {/* ── LEFT — Contact Info with Background Image ── */}
            <div className="lg:w-[53%] relative overflow-hidden rounded-2xl">
                {/* Background Image */}
              <img
                src={ContactBgImg}
                alt="Contact background"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay on image */}
              <div className="absolute inset-0 bg-black/70 rounded-2xl" />

              {/* Content above image */}
              <div className="relative z-10 flex flex-col justify-between gap-10 h-full p-6 md:p-8 min-h-[400px] lg:min-h-[574px]">

                {/* Top — Title + Description */}
                <div>
                  <h2 className="font-heading text-3xl md:text-[44px] md:leading-[70px] font-bold text-dark-text mb-2">
                    Contact Information
                  </h2>
                  <p className="font-body text-base md:text-xl md:leading-8 text-dark-text">
                    Have a question, feedback, or just want to say hi? We'd love to hear from you!
                  </p>
                </div>

                {/* Bottom — Contact Details */}
                <div className="flex flex-col gap-4">

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-dark-text flex-shrink-0">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="font-body text-base md:text-xl text-dark-text break-all">
                      {CONTACT_EMAIL}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* ── RIGHT — Contact Form ── */}
            <div className="flex-1 flex flex-col justify-center">
              <form onSubmit={handleSubmit(handleSend)} className="flex flex-col gap-6">

                 {/* Using reusable InputField for Name */}
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  error={errors.name?.message}
                  {...register("name", { 
                    required: "Name is required"
                 })}
                />

                {/* Using reusable InputField for Email */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address"
                    }
                  })}
                />

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-base md:text-lg text-light-text">
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message..."
                    rows={6}
                    className="w-full px-3 py-3 rounded-xl bg-[#050B0A]/5 border
                     border-[#050B0A]/15 text-light-text
                      placeholder:text-light-outline-secondary focus:outline-none focus:border-light-primary
 focus:ring-2 focus:ring-dark-primary-10 transition-all text-base resize-y min-h-[200px]"
                    {...register("message", { 
                      required: "Message is required"
                    })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message?.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-fit px-6 py-2.5 rounded-xl bg-light-primary text-white font-body font-medium text-base md:text-lg hover:opacity-90 active:scale-[0.99] transition-all duration-200"
                >
                  Submit
                </button>
                {sent && (
                  <p className="font-body text-sm text-light-text">
                    Thanks! Your email app should open with your message. If it didn't, email us at {CONTACT_EMAIL}.
                  </p>
                )}

              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsSection;
