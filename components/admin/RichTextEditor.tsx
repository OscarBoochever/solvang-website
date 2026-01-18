'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)
  const [showPreview, setShowPreview] = useState(false)

  // Track current formatting state
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    blockType: 'p',
  })

  // Initialize editor with value only once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value
      isInitialized.current = true
    }
  }, [value])

  // Update format state when selection changes
  useEffect(() => {
    const updateFormatState = () => {
      setFormatState({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        blockType: getBlockType(),
      })
    }

    const getBlockType = () => {
      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return 'p'

      let node: Node | null = selection.anchorNode
      while (node && node !== editorRef.current) {
        if (node.nodeType === 1) {
          const tagName = (node as Element).tagName.toLowerCase()
          if (['h1', 'h2', 'h3', 'h4', 'p'].includes(tagName)) {
            return tagName
          }
        }
        node = node.parentNode
      }
      return 'p'
    }

    document.addEventListener('selectionchange', updateFormatState)
    return () => document.removeEventListener('selectionchange', updateFormatState)
  }, [])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleBlockType = (type: string) => {
    execCommand('formatBlock', type)
  }

  const ToolbarButton = ({
    onClick,
    title,
    children,
    active = false
  }: {
    onClick: () => void
    title: string
    children: React.ReactNode
    active?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-navy-100 text-navy-700' : ''}`}
    >
      {children}
    </button>
  )

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-300 mx-1" />
  )

  return (
    <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-navy-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">
        {/* Block Type / Headings */}
        <select
          value={formatState.blockType}
          onChange={(e) => handleBlockType(e.target.value)}
          className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50 min-w-[120px]"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <ToolbarDivider />

        {/* Text Style */}
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold (Ctrl+B)" active={formatState.bold}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('italic')} title="Italic (Ctrl+I)" active={formatState.italic}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M19 4h-9M14 20H5M15 4L9 20" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('underline')} title="Underline (Ctrl+U)" active={formatState.underline}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough" active={formatState.strikeThrough}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M16 4H9a3 3 0 00-3 3v0a3 3 0 003 3h6a3 3 0 013 3v0a3 3 0 01-3 3H8M4 12h16" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative">
          <input
            type="color"
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Text Color"
            defaultValue="#000000"
          />
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 6h18M6 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 6h18M9 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="4" cy="6" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="4" cy="18" r="2" />
            <rect x="9" y="5" width="12" height="2" rx="1" />
            <rect x="9" y="11" width="12" height="2" rx="1" />
            <rect x="9" y="17" width="12" height="2" rx="1" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <text x="2" y="8" fontSize="7" fontWeight="bold">1</text>
            <text x="2" y="14" fontSize="7" fontWeight="bold">2</text>
            <text x="2" y="20" fontSize="7" fontWeight="bold">3</text>
            <rect x="9" y="5" width="12" height="2" rx="1" />
            <rect x="9" y="11" width="12" height="2" rx="1" />
            <rect x="9" y="17" width="12" height="2" rx="1" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
          title="Insert Link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={() => execCommand('unlink')} title="Remove Link">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            <path d="M4 20L20 4" strokeWidth={2} />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Clear Formatting */}
        <ToolbarButton onClick={() => execCommand('removeFormat')} title="Clear Formatting">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Preview */}
        <ToolbarButton onClick={() => setShowPreview(true)} title="Preview">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor - styled to match actual page appearance */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-text-editor min-h-[300px] p-6 focus:outline-none bg-white"
        data-placeholder={placeholder}
      />

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div
                className="prose prose-navy max-w-none rich-text-content"
                dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rich-text-editor {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: #374151;
        }
        .rich-text-editor > *:first-child {
          margin-top: 0;
        }
        .rich-text-editor h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        .rich-text-editor h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .rich-text-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .rich-text-editor h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .rich-text-editor p {
          margin-bottom: 1rem;
          min-height: 1.75em;
        }
        .rich-text-editor ul {
          list-style-type: disc;
          list-style-position: outside;
          margin-bottom: 1rem;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        .rich-text-editor ol {
          list-style-type: decimal;
          list-style-position: outside;
          margin-bottom: 1rem;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        .rich-text-editor li {
          margin-bottom: 0.5rem;
        }
        .rich-text-editor a {
          color: #1e4d78;
          text-decoration: underline;
        }
        .rich-text-editor a:hover {
          color: #1e3a5f;
        }
        .rich-text-editor div {
          margin-bottom: 1rem;
        }
        .rich-text-editor br {
          display: block;
          content: "";
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  )
}
