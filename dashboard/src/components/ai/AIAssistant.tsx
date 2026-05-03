"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import styles from './AIAssistant.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de Service PC Master. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} color="var(--accent-primary)" />
              <h3>Asistente IA</h3>
            </div>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && <div className={styles.typing}>La IA está pensando...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form 
            className={styles.inputArea} 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input 
              type="text" 
              placeholder="Escribe tu duda técnica..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading}>
              <Send size={18} color="#000" />
            </button>
          </form>
        </div>
      )}

      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} color="#000" /> : <MessageSquare size={28} color="#000" />}
      </button>
    </div>
  );
}
