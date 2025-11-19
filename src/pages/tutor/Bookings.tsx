import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const navigate = useNavigate();

  // Mock bookings - in a real app this would come from backend
  const bookings = [
    { id: 1, student: "Aneesh Puranik", date: "2025-11-20", time: "10:00 AM" },
    { id: 2, student: "Emily Rodriguez", date: "2025-11-22", time: "2:00 PM" },
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((b) => (
          <Card key={b.id} className="hover:shadow">
            <CardHeader>
              <CardTitle>{b.student}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{b.date} • {b.time}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => alert(`Marking ${b.id} as complete`)}>Mark Complete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default Bookings;
