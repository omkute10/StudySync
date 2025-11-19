import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGemini } from "@/hooks/useGemini";
import { Loader2 } from "lucide-react";

interface MatchResult {
  score: number;
  reasoning: string;
}

export const GeminiTutorMatcher = () => {
  const [studentProfile, setStudentProfile] = useState("");
  const [tutorProfile, setTutorProfile] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const { match, isMatching, error } = useGemini({
    onSuccess: (data) => {
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          setMatchResult(parsed);
        } catch {
          setMatchResult({
            score: 0,
            reasoning: data,
          });
        }
      }
    },
    onError: (err) => {
      console.error("Matching error:", err);
    },
  });

  const handleMatch = () => {
    if (studentProfile.trim() && tutorProfile.trim()) {
      match(studentProfile, tutorProfile);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Tutor Matcher</CardTitle>
        <CardDescription>
          Use AI to analyze compatibility between students and tutors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Profile</label>
          <Textarea
            placeholder="Enter student details: learning style, subjects, goals, experience level..."
            value={studentProfile}
            onChange={(e) => setStudentProfile(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tutor Profile</label>
          <Textarea
            placeholder="Enter tutor details: expertise, teaching style, experience, specializations..."
            value={tutorProfile}
            onChange={(e) => setTutorProfile(e.target.value)}
            className="min-h-24"
          />
        </div>

        <Button
          onClick={handleMatch}
          disabled={isMatching || !studentProfile.trim() || !tutorProfile.trim()}
          className="w-full"
        >
          {isMatching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Compatibility"
          )}
        </Button>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Error: {error.message}
          </div>
        )}

        {matchResult && (
          <div className="space-y-3 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Compatibility Score</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${matchResult.score}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {matchResult.score}%
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Analysis</span>
              <p className="mt-1 text-sm text-gray-600">{matchResult.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
