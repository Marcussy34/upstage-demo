import { useState } from 'react';
import Head from 'next/head';

export default function Chatbot() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      
      // Add assistant message to chat
      const assistantMessage = { role: 'assistant', content: data.answer };
      setMessages(prev => [...prev, assistantMessage]);
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleClearVectors = async () => {
    try {
      const response = await fetch('/api/delete-vectors', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear vectors');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'All vectors have been cleared. Please re-upload your documents.'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to clear vectors. Please try again.'
      }]);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>RAG Chatbot</title>
        <meta name="description" content="RAG Chatbot using Pinecone and Upstage" />
      </Head>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>RAG Chatbot</h1>
          <button
            onClick={handleClearVectors}
            style={{
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear All Vectors
          </button>
        </div>
        
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              Ask a question to start chatting
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="content">{message.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="query-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 1rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        main {
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        h1 {
          margin-bottom: 2rem;
        }
        
        .chat-container {
          width: 100%;
          height: 500px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 1rem;
          overflow-y: auto;
          margin-bottom: 1rem;
          background: #f9f9f9;
        }
        
        .empty-state {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }
        
        .messages {
          display: flex;
          flex-direction: column;
        }
        
        .message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          max-width: 80%;
        }
        
        .user {
          align-self: flex-end;
          background-color: #0070f3;
          color: white;
        }
        
        .assistant {
          align-self: flex-start;
          background-color: #e5e5e5;
          color: #333;
        }
        
        .content {
          word-break: break-word;
        }
        
        .query-form {
          display: flex;
          width: 100%;
        }
        
        input {
          flex-grow: 1;
          padding: 0.75rem;
          border: 1px solid #e5e5e5;
          border-radius: 4px 0 0 4px;
          font-size: 1rem;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 1rem;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 