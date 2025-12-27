'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot, X, MessageSquare, User } from 'lucide-react';
import { continueChat, type ChatMessage } from '@/ai/flows/chat';

const initialMessage: ChatMessage = {
    role: 'model' as const,
    content: `Hello! I'm RaktSahayak, your AI assistant for blood donation queries. 

You can ask me things like:
- "Can I donate blood if I have a tattoo?"
- "What should I eat after donating?"
- "How long does donation take?"

How can I help you today?`
};

export function RaktSahayak() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);


    const handleSend = async () => {
        if (!input.trim()) {
            return;
        };

        const userMessage: ChatMessage = { role: 'user' as const, content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // We slice(1) to remove the initial greeting message
            const history = newMessages.slice(1);
            const botResponse = await continueChat(history);

            setMessages(prev => [...prev, {role: 'model', content: botResponse}]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model' as const, content: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="fixed bottom-24 right-6 z-50">
            {isOpen && (
                <div className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
                    <header className="bg-primary text-primary-foreground p-3 flex justify-between items-center rounded-t-lg">
                        <h2 className="font-bold text-lg">RaktSahayak AI</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </header>
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-2.5 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                )}
                                <div className={`p-3 rounded-lg max-w-xs ${message.role === 'user' ? 'bg-gray-200 text-gray-800 rounded-br-none' : 'bg-primary/10 text-primary-foreground-dark rounded-bl-none'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                 {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-700" />
                                    </div>
                                )}
                            </div>
                        ))}
                         {loading && (
                            <div className="flex items-start gap-2.5">
                                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            disabled={loading}
                        />
                        <Button onClick={handleSend} disabled={loading} size="icon" className="flex-shrink-0">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            )}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
                size="icon"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
            </Button>
        </div>
    );
}
