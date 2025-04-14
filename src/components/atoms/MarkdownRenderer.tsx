import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type MarkdownRendererProps = {
  content: string;
};

function CodeBlock({ inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, '');
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  if (!inline && match) {
    return (
      <div className="relative my-4">
        <button 
          onClick={handleCopy} 
          className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {copied ? 'Copied' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus}
          PreTag="div"
          className="rounded-lg overflow-x-auto"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  } else {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
}

function LinkRenderer({ href, children, ...rest }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline cursor-pointer text-blue-500"
      {...rest}
    >
      {children}
    </a>
  );
}

// Custom renderer for paragraphs
function ParagraphRenderer({ children }: any) {
  return (
    <div>
      <p>{children}</p>
      <hr className="my-4" />
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none break-words whitespace-normal mb-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ 
          code: CodeBlock,
          a: LinkRenderer,
          p: ParagraphRenderer
        }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}