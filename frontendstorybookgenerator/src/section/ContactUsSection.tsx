import ContactBgImg from "../assets/images/contactbg.png"
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
  const handleChange = (e: any) => {
    console.log(e);
    
  };


  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* ── MAIN CONTENT ── */}
      <section
        className="w-full pt-24 pb-12 px-6 md:px-12 xl:px-20"
      >
        <Navbar bglight ={true}/>
        <div className="max-w-7xl mx-auto">

          {/* ── TOP BADGE ── */}
          <div className="flex justify-center mb-5">
            <span className="font-body px-5 py-2 rounded-full border-light-outline-secondary dark:border-dark-primary-30 text-sm 
            font-medium text-light-text dark:text-dark-text bg-light-on-primary dark:bg-dark-primary-10">
              Contact Us
            </span>
          </div>

          {/* ── HEADING ── */}
          <h1 className="font-heading text-4xl md:text-4xl font-bold text-center text-light-text dark:text-dark-text mb-10">
            Have questions? Ready to help!
          </h1>

          {/* ── MAIN CARD ── */}
          <div className="flex p-5 flex-col lg:flex-row rounded-3xl overflow-hidden border-light-outline-secondary
           dark:border-dark-primary-30 shadow-lg bg-light-on-primary dark:bg-dark-bg">

            {/* ── LEFT — Contact Info with Background Image ── */}
            <div className="lg:w-[52%] relative overflow-hidden rounded-2xl m-3">
                {/* Background Image */}
              <img
                src={ContactBgImg}
                alt="Contact background"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay on image */}
              <div className="absolute inset-0 bg-black/50 rounded-2xl" />

              {/* Content above image */}
              <div className="relative z-10 flex flex-col justify-between h-full p-8 min-h-[400px]">

                {/* Top — Title + Description */}
                <div>
                  <h2 className="font-heading text-3xl font-bold text-white mb-4">
                    Contact Information
                  </h2>
                  <p className="font-body text-sm text-white/80 leading-relaxed max-w-xs">
                    Have a question, feedback, or just want to say hi? We'd love to hear from you!
                  </p>
                </div>

                {/* Bottom — Contact Details */}
                <div className="flex flex-col gap-4">

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span className="font-body text-sm text-white">
                      +977 9800000000
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="font-body text-sm text-white">
                      support@fynova.com
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="font-body text-sm text-white">
                      Kathmandu, Nepal
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* ── RIGHT — Contact Form ── */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <form onSubmit={handleSubmit(handleChange)} className="flex flex-col gap-5">

                 {/* Using reusable InputField for Name */}
                <InputField
                  label="Name"
                  type="text"
                  error={errors.name?.message}
                  {...register("name", { 
                    required: "Name is required"
                 })}
                />

                {/* Using reusable InputField for Email */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder=" "
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
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-light-bg dark:bg-dark-primary-10 border
                     border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text
                      placeholder:text-light-outline-secondary focus:outline-none focus:border-light-primary
                       dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all text-sm resize-none"
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
                  className="w-fit px-8 py-3 rounded-xl bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200"
                >
                  Submit
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsSection;
