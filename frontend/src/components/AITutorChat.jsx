import { useState } from "react";

export default function AITutorChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m your language tutor. What would you like to talk about today?" },
  ]);
  const [input, setInput] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          targetLanguage,
          level,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      const reply = data?.reply || "Sorry, I didn’t catch that. Could you try again?";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setError("Could not reach the tutor. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I’m having trouble responding right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto border rounded-lg p-4 bg-white shadow-sm space-y-3">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Target language</label>
          <input
            className="border rounded px-3 py-2 text-sm"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            placeholder="e.g., Hindi"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Level</label>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="h-80 overflow-y-auto border rounded p-3 bg-gray-50 space-y-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              m.role === "assistant" ? "bg-purple-50 border border-purple-100" : "bg-white border"
            }`}
          >
            <div className="text-xs uppercase text-gray-500 mb-1">
              {m.role === "assistant" ? "Tutor" : "You"}
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex flex-col gap-2">
        <textarea
          className="border rounded p-3 text-sm"
          rows="3"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}

