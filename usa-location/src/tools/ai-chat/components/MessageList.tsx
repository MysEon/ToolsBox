'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '../types/chat';
import { MessageUtils } from '../utils/messageUtils';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  showTruncationWarning?: boolean;
}

export default function MessageList({ messages, isLoading, showTruncationWarning }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 复制消息内容
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // 渲染消息
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-indigo-600 text-white'
              : isSystem
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          }`}
        >
          {/* 消息头部 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {isUser ? (
                <User className="h-4 w-4" />
              ) : isSystem ? (
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
              <span className="text-xs opacity-75">
                {isUser ? '你' : isSystem ? '系统' : 'AI助手'}
              </span>
              <span className="text-xs opacity-50">
                {MessageUtils.formatMessageTime(message.timestamp)}
              </span>
            </div>
            
            <button
              onClick={() => copyMessage(message.content, message.id)}
              className={`p-1 rounded hover:bg-black/10 transition-colors ${
                isUser ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              title="复制消息"
            >
              {copiedMessageId === message.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>

          {/* 文件附件 */}
          {message.fileAttachments && message.fileAttachments.length > 0 && (
            <div className="mb-3 p-2 rounded bg-black/10">
              <div className="text-xs opacity-75 mb-1">附件:</div>
              {message.fileAttachments.map(file => (
                <div key={file.id} className="text-xs opacity-90">
                  📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          )}

          {/* 消息内容 */}
          <div className="prose prose-sm max-w-none">
            {isUser || isSystem ? (
              // 用户和系统消息直接显示
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              // AI消息使用Markdown渲染
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>开始你的第一次对话吧！</p>
            <p className="text-sm mt-2">你可以上传PDF文件让AI帮你分析</p>
          </div>
        </div>
      ) : (
        <>
          {/* 上下文截断警告 */}
          {showTruncationWarning && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">
                  由于对话历史较长，部分早期消息已被截断以适应模型限制。AI仍能看到最近的对话内容。
                </span>
              </div>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* 加载指示器 */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
