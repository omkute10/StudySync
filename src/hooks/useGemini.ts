import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { geminiClient } from "@/lib/gemini";

interface UseGeminiOptions {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
}

export const useGemini = (options?: UseGeminiOptions) => {
  const [streamingText, setStreamingText] = useState("");

  const generateMutation = useMutation({
    mutationFn: (prompt: string) => geminiClient.generateText(prompt),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  const streamMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setStreamingText("");
      await geminiClient.generateWithStreaming(prompt, (chunk) => {
        setStreamingText((prev) => prev + chunk);
      });
    },
    onSuccess: () => {
      options?.onSuccess?.(streamingText);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: ({
      text,
      type,
    }: {
      text: string;
      type?: string;
    }) => geminiClient.analyzeText(text, type),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  const matchMutation = useMutation({
    mutationFn: ({
      studentProfile,
      tutorProfile,
    }: {
      studentProfile: string;
      tutorProfile: string;
    }) => geminiClient.matchTutorBuddy(studentProfile, tutorProfile),
  });

  const studyPlanMutation = useMutation({
    mutationFn: ({
      topic,
      level,
      duration,
    }: {
      topic: string;
      level: string;
      duration: string;
    }) => geminiClient.generateStudyPlan(topic, level, duration),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  return {
    // Text generation
    generate: useCallback(
      (prompt: string) => generateMutation.mutate(prompt),
      [generateMutation]
    ),
    generateAsync: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generatedText: generateMutation.data,

    // Streaming
    stream: useCallback(
      (prompt: string) => streamMutation.mutate(prompt),
      [streamMutation]
    ),
    streamAsync: streamMutation.mutateAsync,
    isStreaming: streamMutation.isPending,
    streamingText,

    // Analysis
    analyze: useCallback(
      (text: string, type?: string) =>
        analyzeMutation.mutate({ text, type }),
      [analyzeMutation]
    ),
    analyzeAsync: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    analysisResult: analyzeMutation.data,

    // Tutor/Buddy matching
    match: useCallback(
      (studentProfile: string, tutorProfile: string) =>
        matchMutation.mutate({ studentProfile, tutorProfile }),
      [matchMutation]
    ),
    matchAsync: matchMutation.mutateAsync,
    isMatching: matchMutation.isPending,
    matchResult: matchMutation.data,

    // Study plan generation
    generateStudyPlan: useCallback(
      (topic: string, level: string, duration: string) =>
        studyPlanMutation.mutate({ topic, level, duration }),
      [studyPlanMutation]
    ),
    generateStudyPlanAsync: studyPlanMutation.mutateAsync,
    isGeneratingPlan: studyPlanMutation.isPending,
    studyPlan: studyPlanMutation.data,

    // Error states
    error:
      generateMutation.error ||
      streamMutation.error ||
      analyzeMutation.error ||
      matchMutation.error ||
      studyPlanMutation.error,
  };
};
