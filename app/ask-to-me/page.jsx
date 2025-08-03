// app/ask-to-me/page.jsx
export default function AskToMePage() {
  return (
    <div className="h-screen">
      <iframe 
        src="https://whispa.sh/@devnova_id" 
        className="w-full h-full border-0"
        title="Whispa Profile"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}