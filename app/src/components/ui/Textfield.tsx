import { Send } from "lucide-react";
import { useRef, useState } from "react";

interface TextFieldProps {
  onSendMessage: (message: string) => void;
}

export default function TextField({ onSendMessage }: TextFieldProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative w-80">
      <textarea
        ref={textareaRef}
        className="w-full px-4 py-2 pr-12 outline-none bg-textfield rounded-lg hover:shadow-lg"
        placeholder="Escribe una idea.."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleInput}
        rows={1}
        style={{ resize: "none", maxHeight: "4.5em", overflowY: "hidden" }}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center pr-4"
        onClick={handleSend}
      >
        <Send />
      </button>
    </div>
  );
}
