"use client"

import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

interface RichTextRendererProps {
  content: string
  className?: string
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && content) {
      // Sanitize the HTML content to prevent XSS attacks
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
      })
      
      // Set the sanitized HTML content
      contentRef.current.innerHTML = sanitizedContent
      
      // Add styling to make it look good
      const style = document.createElement('style')
      style.textContent = `
        .rich-text-content h1 { font-size: 2rem; font-weight: bold; margin: 1.5rem 0 1rem 0; }
        .rich-text-content h2 { font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0; }
        .rich-text-content h3 { font-size: 1.25rem; font-weight: bold; margin: 1rem 0 0.5rem 0; }
        .rich-text-content p { margin: 0.75rem 0; line-height: 1.6; }
        .rich-text-content ul { margin: 0.75rem 0; padding-left: 1.5rem; }
        .rich-text-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .rich-text-content li { margin: 0.25rem 0; }
        .rich-text-content blockquote { 
          border-left: 4px solid #e5e7eb; 
          padding-left: 1rem; 
          margin: 1rem 0; 
          font-style: italic; 
          color: #6b7280;
        }
        .rich-text-content a { 
          color: #3b82f6; 
          text-decoration: underline; 
        }
        .rich-text-content a:hover { 
          color: #1d4ed8; 
        }
        .rich-text-content img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 0.5rem; 
          margin: 1rem 0; 
        }
        .rich-text-content strong { font-weight: bold; }
        .rich-text-content em { font-style: italic; }
      `
      
      // Remove existing style if any
      const existingStyle = contentRef.current.querySelector('style')
      if (existingStyle) {
        existingStyle.remove()
      }
      
      // Add the style
      contentRef.current.appendChild(style)
    }
  }, [content])

  return (
    <div 
      ref={contentRef}
      className={`rich-text-content ${className}`}
    />
  )
}
