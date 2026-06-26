import { useState, useEffect, useRef } from "react";

// Components
import MessageBubble from "./components/MessageBubble";
import Card from "./components/Card";
import ButtonRow from "./components/ButtonRow";
import TypingIndicator from "./components/TypingIndicator";
import List from "./components/List";
import ProductCard from "./components/ProductCard";


function App() {
  const [messages, setMessages] = useState([]);
  // Show typing animation, then welcome message
  useEffect(() => {
    // 1. Show typing indicator
    setLoading(true);

    const timer = setTimeout(() => {
      // 2. Add welcome message
      setMessages([
        {
          sender: "agent",
          text: "Hi there! I’m here to help with orders, returns, FAQs, or anything else you need.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // 3. Hide typing indicator
      setLoading(false);
    }, 1200); // typing delay (1.2s feels natural)

    return () => clearTimeout(timer);
  }, []);


  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);


  async function sendMessage(forcedValue, options = {}) {
    const { silent = false } = options;

    const textToSend = forcedValue || input;
    if (!textToSend.trim()) return;

    // ⭐ Only add user bubble if NOT silent
    if (!silent) {
      const userMessage = {
        sender: "user",
        text: textToSend,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      //  Start conditional polling if backend requests it
      if (data.startPolling) {
        setShouldPoll(true);
}

      const agentMessage = {
        sender: "agent",
        text: data.text,
        ticketId: data.ticketId || null,
        agent: data.agent,
        card: data.card || null,
        buttons: data.buttons || null,
        list: data.list || null,
        image: data.image || null,
        product: data.product || null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Error contacting server.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setLoading(false);
  }


  // Handle quick reply button clicks
  function handleButtonClick(value) {
    sendMessage(value, { silent: true });
  }

  // Auto-scroll
  useEffect(() => {
    const chat = document.getElementById("chat");
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [messages, loading]);

  // --- Async webhook event polling ---
  const pollingRef = useRef(null);

 useEffect(() => {
  if (!shouldPoll) return;

  async function poll() {
    try {
      const res = await fetch("http://localhost:3001/events");
      const data = await res.json();

      // If events exist, append them and THEN stop polling
      if (data.events && data.events.length > 0) {
        data.events.forEach((evt) => {
          setMessages((prev) => [
            ...prev,
            {
              sender: evt.sender || "agent",
              text: evt.text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        });

        // NOW stop polling
        setShouldPoll(false);
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        return;
      }

      // Otherwise keep polling until event arrives
    } catch (err) {
      console.error("Event polling failed:", err);
    }
  }

  pollingRef.current = setInterval(poll, 1000);

  return () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };
}, [shouldPoll]);




  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-[400px] h-[600px] bg-white rounded-2xl shadow-xl p-4 flex flex-col border border-gray-200 animate-scaleIn">
        {/* Header */}
        <div className="border-b pb-3 mb-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-700">Virtual Agent</h2>
        </div>

        {/* Chat */}
        <div
          id="chat"
          className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col gap-1">
              {/* Bubble */}
              {!msg.card && !msg.product && <MessageBubble msg={msg} />}
              
              {/* Product card */}
              {msg.product && <ProductCard product={msg.product} />}

              {/* Card */}
              {msg.card && <Card card={msg.card} onClick={handleButtonClick} />}

              {/* Buttons */}
              {msg.buttons && (
                <ButtonRow buttons={msg.buttons} onClick={handleButtonClick} />
              )}
              {msg.list && (
                <List list={msg.list} onClick={handleButtonClick} />
          )}

            </div>
          ))}

          {/* Typing indicator */}
          {loading && <TypingIndicator />}
        </div>

        {/* Input */}
        <div className="flex mt-3 bg-white rounded-xl shadow-sm p-2 gap-2 border border-gray-200">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message…"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
