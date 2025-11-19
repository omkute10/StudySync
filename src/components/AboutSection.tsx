import { useEffect, useState, useRef } from "react";
import { Users, BookOpen, Lightbulb, Target } from "lucide-react";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Expert Tutors", value: "500+", icon: BookOpen },
    { label: "Study Groups", value: "2,000+", icon: Lightbulb },
    { label: "Success Rate", value: "95%", icon: Target },
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-accent-light/10" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Learnix
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Learnix is a revolutionary platform designed to transform the way students learn, connect, and succeed in their academic journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className={`${isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-10'} transition-all duration-700 ease-out`}>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              At Learnix, we believe that learning is a collaborative journey. Our mission is to empower students by connecting them with the right resources, tutors, and study partners to achieve their academic goals.
            </p>
            <p className="text-gray-600 mb-4">
              Founded by a team of passionate educators and technologists, Learnix combines the power of AI with human connection to create a personalized learning experience for every student.
            </p>
            <p className="text-gray-600">
              Whether you're looking for a tutor to help with a challenging subject, a study buddy to keep you motivated, or a campus partner for extracurricular activities, Learnix is your one-stop platform for academic success.
            </p>
          </div>
          <div className={`${isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-10'} transition-all duration-700 ease-out`}>
            <img 
              src="https://plus.unsplash.com/premium_photo-1681681082165-fd333bbc037a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3R1ZGVudHMlMjBzdHVkeWluZ3xlbnwwfHwwfHx8MA%3D%3D"
              alt="Students collaborating" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className={`glass p-6 rounded-xl text-center ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-700 ease-out`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 