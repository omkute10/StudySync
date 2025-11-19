import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Interest = "Java" | "React" | "Python" | "SpringBoot" | "JavaScript" | "TypeScript" | "MongoDB" | "PostgreSQL" | "AI" | "MachineLearning" | "WebDev" | "DataScience";
export type Role = "Student" | "Tutor";
export type StudentType = "TutorSeeker" | "StudyBuddy" | "CampusPartner";

interface SignupContextType {
  name: string;
  setName: (name: string) => void;
  age: number | null;
  setAge: (age: number | null) => void;
  gender: string;
  setGender: (gender: string) => void;
  degree: string;
  setDegree: (degree: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string; // Added Password field
  setPassword: (password: string) => void; // Added Password setter
  interests: Interest[];
  toggleInterest: (interest: Interest) => void;
  role: Role | null;
  setRole: (role: Role) => void;
  studentType: StudentType | null;
  setStudentType: (type: StudentType | null) => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};

interface SignupProviderProps {
  children: ReactNode;
}

// Helper to load from localStorage safely
const getStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export const SignupProvider = ({ children }: SignupProviderProps) => {
  // Initialize state from LocalStorage to prevent data loss on refresh
  const [name, setName] = useState<string>(() => getStored("signup_name", ""));
  const [age, setAge] = useState<number | null>(() => getStored("signup_age", null));
  const [gender, setGender] = useState<string>(() => getStored("signup_gender", ""));
  const [degree, setDegree] = useState<string>(() => getStored("signup_degree", ""));
  const [email, setEmail] = useState<string>(() => getStored("signup_email", ""));
  const [password, setPassword] = useState<string>(() => getStored("signup_password", ""));
  const [interests, setInterests] = useState<Interest[]>(() => getStored("signup_interests", []));
  const [role, setRole] = useState<Role | null>(() => getStored("signup_role", null));
  const [studentType, setStudentType] = useState<StudentType | null>(() => getStored("signup_studentType", null));

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("signup_name", JSON.stringify(name));
    localStorage.setItem("signup_age", JSON.stringify(age));
    localStorage.setItem("signup_gender", JSON.stringify(gender));
    localStorage.setItem("signup_degree", JSON.stringify(degree));
    localStorage.setItem("signup_email", JSON.stringify(email));
    localStorage.setItem("signup_password", JSON.stringify(password));
    localStorage.setItem("signup_interests", JSON.stringify(interests));
    localStorage.setItem("signup_role", JSON.stringify(role));
    localStorage.setItem("signup_studentType", JSON.stringify(studentType));
  }, [name, age, gender, degree, email, password, interests, role, studentType]);

  const toggleInterest = (interest: Interest) => {
    setInterests((prev) => 
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <SignupContext.Provider
      value={{
        name, setName,
        age, setAge,
        gender, setGender,
        degree, setDegree,
        email, setEmail,
        password, setPassword, // Ensure these are exposed
        interests, toggleInterest,
        role, setRole,
        studentType, setStudentType,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};