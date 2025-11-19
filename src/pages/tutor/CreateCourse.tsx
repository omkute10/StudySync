import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    alert(`Course created: ${title}`);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreate}>Create Course</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateCourse;
