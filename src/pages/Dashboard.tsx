import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Users, Upload, Search, Bell, LogOut, MessageSquare,
  Calendar, User, X, ArrowLeft, Menu, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSignup } from "@/contexts/SignupContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GeminiChat } from "@/components/GeminiChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { name, age, gender, degree, email, interests, role, studentType } = useSignup();
  
  // State to store detected topics for display
  const [detectedTopics, setDetectedTopics] = useState<string[]>([]);
  
  // Function to check for new interests and store them
  const processDetectedTopics = (newTopics: string[]) => {
    if (newTopics.length > 0) {
      const currentInterests = interests || [];
      const uniqueNewTopics = newTopics.filter(topic => 
        !currentInterests.some(interest => 
          interest.toLowerCase() === topic.toLowerCase()
        )
      );
      
      setDetectedTopics(uniqueNewTopics);
      return uniqueNewTopics;
    }
    return [];
  };
  const [userName, setUserName] = useState("there");
  const [messageText, setMessageText] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{id: number, name: string, image: string} | null>(null);
  const [showMessageBox, setShowMessageBox] = useState(false);
  
  // Dashboard selection persisted per-user (null = not chosen yet)
  const [dashboardChoice, setDashboardChoice] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Determine role from selection (if chosen) or signup context
  const isTutor = dashboardChoice ? dashboardChoice === 'tutor' : role === "Tutor";

  useEffect(() => {
    // Set the user's name from the signup context
    if (name) {
      setUserName(name);
    }

    // If a user is logged in, try to load their persisted dashboard choice
    try {
      if (currentUser && currentUser.uid) {
        const key = `dashboardChoice:${currentUser.uid}`;
        const stored = localStorage.getItem(key);
        if (stored === 'student' || stored === 'tutor') {
          setDashboardChoice(stored);
          return;
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }

    // No persisted choice for this session/user -> reset to null so role controls default
    setDashboardChoice(null);
  }, [name, currentUser?.uid]);

  const handleSelectDashboard = (choice: 'student' | 'tutor') => {
    setDashboardChoice(choice);
    try {
      if (currentUser && currentUser.uid) {
        const key = `dashboardChoice:${currentUser.uid}`;
        localStorage.setItem(key, choice);
      }
    } catch (e) {}
    toast({ title: 'Dashboard selected', description: `Showing the ${choice === 'tutor' ? 'Tutor' : 'Student'} dashboard.` });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
    navigate("/");
  };
  
  const handleUploadPDF = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.click();
    
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        toast({
          title: "PDF Uploaded",
          description: "Processing with AI to extract content and interests...",
          
        });
          let sum= document.getElementById("sum-content");
          sum.innerHTML = "<b>Processing....</b>"
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('http://localhost:8000/upload-pdf', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          
          sum.innerHTML=`<b>Summary</b>: ${result.summary.substring(0, 4000)}${result.summary.length > 4000 ? '...' : ''}`;
          
          if (result.topics && result.topics.length > 0) {
            // Process detected topics and identify new ones
            const newTopics = processDetectedTopics(result.topics);
            
            if (newTopics.length > 0) {
              toast({
                title: "New Interests Detected!",
                description: `Found new topics: ${newTopics.join(', ')}. Check your profile to add them!`,
                duration: 5000,
              });
            } else {
              toast({
                title: "Topics Detected",
                description: `Found: ${result.topics.join(', ')} (already in your interests)`,
              });
            }
            
            console.log('All detected topics:', result.topics);
            console.log('New topics not in interests:', newTopics);
          }
          
        } catch (error) {
          console.error('Error uploading PDF:', error);
          toast({
            title: "Upload Failed",
            description: "Failed to process PDF. Please ensure the backend is running.",
            variant: "destructive",
          });
        }
      }
    };
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to the appropriate search page based on the query
      if (searchQuery.toLowerCase().includes('tutor')) {
        navigate('/search-tutors');
      } else if (searchQuery.toLowerCase().includes('buddy') || searchQuery.toLowerCase().includes('study')) {
        navigate('/search-buddies');
      } else if (searchQuery.toLowerCase().includes('partner') || searchQuery.toLowerCase().includes('campus')) {
        navigate('/search-partners');
      } else {
        // Default to tutors search if no specific keyword is found
        navigate('/search-tutors');
      }
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser) {
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedUser.name}.`,
      });
      setMessageText("");
      setSelectedUser(null);
      setShowMessageBox(false);
      setIsMessageOpen(false);
    }
  };

  const handleSelectUser = (user: {id: number, name: string, image: string}) => {
    setSelectedUser(user);
    setShowMessageBox(true);
  };

  const handleBackToSearch = () => {
    setSelectedUser(null);
    setShowMessageBox(false);
  };

  // Calendar events (now stateful so we can add events)
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "Study Session with Aneesh", date: "2023-06-15", time: "10:00 AM - 11:30 AM" },
    { id: 2, title: "Tutoring Session - Python", date: "2023-06-16", time: "2:00 PM - 3:00 PM" },
    { id: 3, title: "Campus Partner Meetup", date: "2023-06-18", time: "5:00 PM - 6:00 PM" },
    { id: 4, title: "Group Study - Data Science", date: "2023-06-20", time: "1:00 PM - 3:00 PM" },
  ]);

  const addCalendarEvent = (title: string, date: string, time: string) => {
    setCalendarEvents((prev) => [
      ...prev,
      { id: Date.now(), title, date, time },
    ]);
    setIsCalendarOpen(true);
  };

  // Profile image state (local preview only)
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock users for messaging
  const mockUsers = [
    { id: 1, name: "Aneesh Puranik", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Aryan Tambe", image: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Om Kute", image: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Emily Rodriguez", image: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "David Wilson", image: "https://i.pravatar.cc/150?img=5" },
  ];

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(messageSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-accent-light/10">
      {/* Navbar */}
      <nav className="glass fixed-navbar px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold gradient-text">Learnix</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <a href="#" className="nav-link flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </a>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Your Schedule</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    {calendarEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date} | {event.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsCalendarOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
              <DialogTrigger asChild>
                <a href="#" className="nav-link flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Chat</span>
                </a>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] p-0">
                <div className="h-[600px]">
                  <GeminiChat />
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isMessageOpen} onOpenChange={(open) => {
              setIsMessageOpen(open);
              if (!open) {
                // Reset state when dialog is closed
                setSelectedUser(null);
                setShowMessageBox(false);
                setMessageText("");
              }
            }}>
              <DialogTrigger asChild>
                <a href="#" className="nav-link flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                </a>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {showMessageBox && selectedUser ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleBackToSearch}
                          className="h-8 w-8"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span>Message to {selectedUser.name}</span>
                      </div>
                    ) : (
                      "Find a User to Message"
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {!showMessageBox ? (
                    <>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search for a user..."
                          className="pl-10 pr-4 py-2 rounded-lg border-gray-300 w-full"
                          value={messageSearchQuery}
                          onChange={(e) => setMessageSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div 
                              key={user.id} 
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSelectUser(user)}
                            >
                              <img 
                                src={user.image} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="font-medium">{user.name}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No users found. Try a different search term.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-4 p-3 border rounded-lg">
                        <img 
                          src={selectedUser?.image} 
                          alt={selectedUser?.name} 
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium">{selectedUser?.name}</span>
                      </div>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[150px] mb-4"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSendMessage}>Send Message</Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <a href="#" className="nav-link flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Your Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="profile" className="w-full h-full object-cover" onClick={() => document.getElementById('profile-upload')?.click()} />
                        ) : (
                          <div onClick={() => document.getElementById('profile-upload')?.click()} className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                          </div>
                        )}
                        <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setProfileImage(url);
                          }
                        }} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-1 sm:col-span-2">
                        <h3 className="text-lg font-medium">{name || "User"}</h3>
                        <p className="text-sm text-gray-500">{email || "No email provided"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{age || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{gender || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Degree</p>
                        <p className="font-medium">{degree || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium">{role || "Not specified"}</p>
                      </div>
                      
                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-sm text-gray-500">Student Type</p>
                        <p className="font-medium">{studentType || "Not specified"}</p>
                      </div>
                      
                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-sm text-gray-500">Current Interests</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {interests && interests.length > 0 ? (
                            interests.map((interest, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {interest}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No interests specified</p>
                          )}
                        </div>
                      </div>
                      
                      {detectedTopics.length > 0 && (
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-sm text-gray-500">New Topics Detected from PDF</p>
                          <p className="text-xs text-gray-400 mb-2">Click to add to your interests:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {detectedTopics.map((topic, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  toast({
                                    title: "Interest Added!",
                                    description: `"${topic}" has been noted. In a full app, this would update your profile.`,
                                  });
                                  // Remove from detected topics after clicking
                                  setDetectedTopics(prev => prev.filter(t => t !== topic));
                                }}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors border border-green-300"
                              >
                                + {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="col-span-1 sm:col-span-2">
                        <h4 className="text-sm font-medium">Add Calendar Event</h4>
                        <div className="mt-2 space-y-2">
                          <input id="event-title" placeholder="Event title" className="w-full px-3 py-2 border rounded" />
                          <input id="event-date" type="date" className="w-full px-3 py-2 border rounded" />
                          <input id="event-time" type="text" placeholder="Time (e.g. 2:00 PM - 3:00 PM)" className="w-full px-3 py-2 border rounded" />
                          <div className="flex justify-end">
                            <Button onClick={() => {
                              const titleEl = document.getElementById('event-title') as HTMLInputElement | null;
                              const dateEl = document.getElementById('event-date') as HTMLInputElement | null;
                              const timeEl = document.getElementById('event-time') as HTMLInputElement | null;
                              if (titleEl && dateEl && timeEl && titleEl.value && dateEl.value && timeEl.value) {
                                addCalendarEvent(titleEl.value, dateEl.value, timeEl.value);
                                titleEl.value = '';
                                dateEl.value = '';
                                timeEl.value = '';
                                setIsProfileOpen(false);
                                toast({ title: 'Event added', description: 'Your event was added to the schedule.' });
                              } else {
                                toast({ title: 'Missing fields', description: 'Please fill title, date and time.', variant: 'destructive' });
                              }
                            }}>Add Event</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsProfileOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <a href="#" className="nav-link flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600 hover:text-primary focus:outline-none p-2">
            <Menu size={24} />
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's what's happening with your study sessions today.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for tutors, study buddies, or campus partners..."
              className="pl-10 pr-4 py-3 rounded-lg border-gray-300 w-full text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Quick Actions - choose dashboard first, then show tutor/student options */}
        {!dashboardChoice ? (
          <div className="mb-12">
            <Card className="max-w-2xl mx-auto hover:shadow-lg">
              <CardHeader>
                <CardTitle>Choose Your Dashboard</CardTitle>
                <CardDescription>
                  Select which experience you'd like to use right now. You can change this later in your Profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Which dashboard would you like to view?</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-3 w-full">
                  <Button className="w-1/2" onClick={() => handleSelectDashboard('student')}>Student Dashboard</Button>
                  <Button className="w-1/2" onClick={() => handleSelectDashboard('tutor')}>Tutor Dashboard</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isTutor ? (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Manage Bookings
                  </CardTitle>
                  <CardDescription>
                    View and manage your upcoming tutoring sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Confirm or cancel sessions, and review student requests.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/tutor/bookings')}>
                    View Bookings
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Create Course
                  </CardTitle>
                  <CardDescription>
                    Publish a course or listing so students can book you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Add course details, pricing, and availability to attract students.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/tutor/create-course')}>
                    Create Course
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Set Availability
                  </CardTitle>
                  <CardDescription>
                    Configure times when students can book sessions with you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Sync with your calendar and manage open slots.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setIsCalendarOpen(true)}>
                    Manage Calendar
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Find a Tutor
                  </CardTitle>
                  <CardDescription>
                    Connect with expert tutors in your subjects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized help from qualified tutors who can guide you through difficult concepts.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/search-tutors')}
                  >
                    Find Tutors
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Find a Study Buddy
                  </CardTitle>
                  <CardDescription>
                    Connect with peers for collaborative learning.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Find study partners who share your academic interests and learning style.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/search-buddies')}
                  >
                    Match Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Find a Campus Partner
                  </CardTitle>
                  <CardDescription>
                    Connect for activities and events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Find partners for campus activities, sports, and social events.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/search-partners')}
                  >
                    Find Partners
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
        )}

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Upcoming Study Session</CardTitle>
                <CardDescription>
                  <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Python Programming with Aneesh Puranik</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">New Message</CardTitle>
                <CardDescription>
                  <p className="text-sm text-gray-600">From Aryan Tambe</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Hey! Are you free to study React this weekend?</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Reply</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Campus Event</CardTitle>
                <CardDescription>
                  <p className="text-sm text-gray-600">This Saturday</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Cricket match with Om Kute and friends</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Join Event</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Upload Study Materials</h2>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload PDF
              </CardTitle>
              <CardDescription>
                Upload your study materials for AI-powered analysis.
                
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Our AI will analyze your study materials and provide personalized recommendations.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleUploadPDF}
              >
                Upload PDF
              </Button>
            </CardFooter>
          </Card>


          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
              <CardDescription>
                Upload a PDF above to view summary
                
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4" id="sum-content">
                
              </p>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
