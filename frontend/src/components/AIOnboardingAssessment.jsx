import { useState } from "react";

const DEFAULT_QUESTIONS = [
  "Tell us a few sentences about yourself in the target language.",
  "How comfortable are you reading everyday texts (news, menus, messages)?",
  "Describe a recent conversation you had in the target language.",
];

export default function AIOnboardingAssessment() {
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [learningGoal, setLearningGoal] = useState("Conversation");
  const [answers, setAnswers] = useState(DEFAULT_QUESTIONS.map(() => ""));
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLevel("");
    setLoading(true);
    try {
      const payload = { answers, targetLanguage, learningGoal };
      const res = await fetch("/api/ai/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = await res.json();
      setLevel(data?.level || "");
    } catch (err) {
      console.error(err);
      setError("Could not complete assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto border rounded-lg p-5 bg-white shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">AI Placement Assessment</h2>
        <p className="text-sm text-gray-600">Answer a few questions after login to get a personalized starting level.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Target language
          <input
            className="border rounded px-3 py-2 text-sm"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Learning goal (optional)
          <input
            className="border rounded px-3 py-2 text-sm"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Conversation, exams, travel..."
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {DEFAULT_QUESTIONS.map((q, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-800">{q}</label>
            <textarea
              className="border rounded p-3 text-sm"
              rows="3"
              value={answers[idx]}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Assessing..." : "Run assessment"}
        </button>
      </form>

      {level && (
        <div className="p-3 rounded bg-green-50 border border-green-200 text-green-800 text-sm">
          Assigned level: <span className="font-semibold">{level}</span>
        </div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

