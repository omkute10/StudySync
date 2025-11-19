
import { useState } from "react";
import { Send } from "lucide-react";

interface MentorCardProps {
  name: string;
  email: string;
  delay: number;
}

const MentorCard = ({ name, email, delay }: MentorCardProps) => {
  return (
    <a 
      href={`mailto:${email}`}
      className="glass p-4 rounded-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-gray-600 text-sm">{email}</p>
    </a>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form and success message after a delay
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Get in Touch
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-4">Learnix Mentors</h3>
            <div className="space-y-4">
              <MentorCard 
                name="Dr. Sarah Johnson"
                email="sarah@Learnix.com"
                delay={100}
              />
              <MentorCard 
                name="Prof. Michael Chen"
                email="michael@Learnix.com"
                delay={200}
              />
              <MentorCard 
                name="Lisa Blackwell, PhD"
                email="lisa@Learnix.com"
                delay={300}
              />
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
            
            {submitSuccess ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg animate-fade-in">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/40 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/40 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/40 focus:border-transparent outline-none transition"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_15px_rgba(255,191,105,0.5)]'}`}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
