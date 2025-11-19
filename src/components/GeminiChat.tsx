import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGemini } from "@/hooks/useGemini";
import { Send, Loader2 } from "lucide-react";

// Function to clean and format text
const formatText = (text: string): string => {
  // Remove markdown bold/italic markers
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold**
    .replace(/\*(.*?)\*/g, "$1") // Remove *italic*
    .replace(/__(.*?)__/g, "$1") // Remove __bold__
    .replace(/_(.*?)_/g, "$1"); // Remove _italic_
  
  return formatted;
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "gemini";
  timestamp: Date;
}

export const GeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI study assistant powered by Gemini. How can I help you today? I can assist with explanations, study plans, homework help, and more!",
      sender: "gemini",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { generateAsync, isGenerating } = useGemini();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userInput = inputValue;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      // Get response from Gemini
      console.log("Sending prompt to Gemini:", userInput);
      const response = await generateAsync(userInput);
      console.log("Received response from Gemini:", response);
      setRetryCount(0);
      
      const geminiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: formatText(response),
        sender: "gemini",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, geminiMessage]);
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      
      let friendlyMessage = "";
      if (errorMsg.includes("overloaded") || errorMsg.includes("429") || errorMsg.includes("503")) {
        friendlyMessage = "🔄 The AI assistant is currently busy. I've automatically retried several times. Please try again in a moment!";
      } else if (errorMsg.includes("API key")) {
        friendlyMessage = "❌ There's an issue with the API key configuration. Please check your settings.";
      } else if (errorMsg.includes("404")) {
        friendlyMessage = "❌ The AI model is not available. Please try again later.";
      } else {
        friendlyMessage = `❌ I encountered an error: ${errorMsg}. Please try again.`;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: friendlyMessage,
        sender: "gemini",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setRetryCount((prev) => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>Gemini AI Study Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.text}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-gray-600"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me anything about your studies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isGenerating || !inputValue.trim()}
              size="icon"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Press Enter to send • Powered by Google Gemini
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
