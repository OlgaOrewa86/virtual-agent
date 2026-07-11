import { useState, useEffect, useRef } from "react";

// Components
import MessageBubble from "./components/MessageBubble";
import Card from "./components/Card";
import ButtonRow from "./components/ButtonRow";
import TypingIndicator from "./components/TypingIndicator";
import List from "./components/List";
import ProductCard from "./components/ProductCard";

import { sendAgentMessage, pollEvents } from "./apiClient";



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

    const rawText = forcedValue || input;

    // --- Input Handling ---
    const textToSend = rawText.trim();        // Trim whitespace

    if (!textToSend) return;                  // Reject empty

    const MAX_LEN = 300;
    if (textToSend.length > MAX_LEN) {
      setMessages(prev => [
        ...prev,
        {
          sender: "agent",
          text: `Your message is too long. Please keep it under ${MAX_LEN} characters.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      return;
    }
    //  Only add user bubble if NOT silent
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
      const data = await sendAgentMessage(textToSend);

      if (data.startPolling) {
        setShouldPoll(true);
      }

      const agentMessage = {
        sender: "agent",
        text: data.text,
        ticketId: data.ticketId,
        agent: data.agent,
        card: data.card,
        buttons: data.buttons,
        list: data.list,
        image: data.image,
        product: data.product,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      console.error("sendMessage failed:", err);

      setMessages(prev => [
        ...prev,
        {
          sender: "agent",
          text: "Something went wrong — please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }

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

  const MAX_ATTEMPTS = 20;      // 20 seconds total
  let attempts = 0;

  async function poll() {
    try {

      attempts++;
      const events = await pollEvents();

      if (events.length > 0) {
        events.forEach(evt => {
          setMessages(prev => [
            ...prev,
            {
              sender: evt.sender,
              text: evt.text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        });

        // Stop polling
        setShouldPoll(false);
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        return;
      }

       // Stop if max attempts reached
      if (attempts >= MAX_ATTEMPTS) {
        setMessages(prev => [
          ...prev,
          {
            sender: "agent",
            text: "Still working on your request — this may take a bit longer.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        setShouldPoll(false);
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      // Otherwise keep polling until event arrives
    } catch (err) {
      console.error("Event polling failed:", err);
      
      setMessages(prev => [
        ...prev,
        {
          sender: "agent",
          text: "Something went wrong — please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      
      setShouldPoll(false);
      clearInterval(pollingRef.current);
      pollingRef.current = null;
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
