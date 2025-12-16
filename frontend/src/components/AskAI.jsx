import { useState } from "react";

export default function AskAI() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("explain");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, targetLanguage }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = await res.json();
      setResult(data?.result || "");
    } catch (err) {
      console.error(err);
      setError("Could not get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto border rounded-lg p-4 bg-white shadow-sm space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Explain / Translate</h2>
        <p className="text-sm text-gray-600">Paste text, choose mode, and get a quick AI response.</p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <textarea
          className="w-full border rounded p-3 text-sm"
          rows="4"
          placeholder="Paste text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm text-gray-700 flex items-center gap-2">
            Mode
            <select
              className="border rounded px-3 py-2 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={loading}
            >
              <option value="explain">Explain</option>
              <option value="translate">Translate</option>
            </select>
          </label>

          {mode === "translate" && (
            <label className="text-sm text-gray-700 flex items-center gap-2">
              Target language
              <input
                className="border rounded px-3 py-2 text-sm"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
                placeholder="e.g., Hindi"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Working..." : "Submit"}
        </button>
      </form>

      {result && (
        <div className="p-3 rounded bg-gray-50 border text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

