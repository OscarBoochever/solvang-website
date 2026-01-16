'use client'

import { useState, useEffect, useCallback } from 'react'
import Translated from '@/components/Translated'

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large'
  highContrast: boolean
  dyslexiaFont: boolean
  reducedMotion: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('a11y-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applySettings(parsed)
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [])

  // Apply settings to document
  const applySettings = useCallback((s: AccessibilitySettings) => {
    const html = document.documentElement
    const body = document.body

    // Font size
    html.classList.remove('font-size-normal', 'font-size-large', 'font-size-x-large')
    html.classList.add(`font-size-${s.fontSize}`)

    // High contrast
    if (s.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    // Dyslexia font
    if (s.dyslexiaFont) {
      body.classList.add('dyslexia-font')
    } else {
      body.classList.remove('dyslexia-font')
    }

    // Reduced motion
    if (s.reducedMotion) {
      html.classList.add('reduce-motion')
    } else {
      html.classList.remove('reduce-motion')
    }
  }, [])

  // Update setting and persist
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('a11y-settings', JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  // Reset all settings
  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('a11y-settings')
    applySettings(defaultSettings)
  }

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted) return null

  return (
    <div className="accessibility-toolbar">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="a11y-toggle"
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        title="Accessibility Options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          {/* Head */}
          <circle cx="12" cy="4.5" r="2.5" />
          {/* Arms */}
          <path d="M6 9.5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Body */}
          <path d="M12 10v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left Leg */}
          <path d="M12 14l-3.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Right Leg */}
          <path d="M12 14l3.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Accessibility Options</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="a11y-panel"
          className="a11y-panel"
          role="dialog"
          aria-label="Accessibility Settings"
        >
          <div className="a11y-header">
            <h2 className="a11y-title"><Translated>Accessibility</Translated></h2>
            <button
              onClick={() => setIsOpen(false)}
              className="a11y-close"
              aria-label="Close accessibility panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          <div className="a11y-content">
            {/* Font Size */}
            <div className="a11y-option">
              <span className="a11y-label" id="font-size-label"><Translated>Text Size</Translated></span>
              <div className="a11y-font-buttons" role="radiogroup" aria-labelledby="font-size-label">
                <button
                  onClick={() => updateSetting('fontSize', 'normal')}
                  className={`a11y-font-btn ${settings.fontSize === 'normal' ? 'active' : ''}`}
                  aria-pressed={settings.fontSize === 'normal'}
                  title="Normal text size"
                >
                  A
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'large')}
                  className={`a11y-font-btn a11y-font-lg ${settings.fontSize === 'large' ? 'active' : ''}`}
                  aria-pressed={settings.fontSize === 'large'}
                  title="Large text size"
                >
                  A
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'x-large')}
                  className={`a11y-font-btn a11y-font-xl ${settings.fontSize === 'x-large' ? 'active' : ''}`}
                  aria-pressed={settings.fontSize === 'x-large'}
                  title="Extra large text size"
                >
                  A
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="a11y-option">
              <label className="a11y-toggle-label">
                <span className="a11y-label"><Translated>High Contrast</Translated></span>
                <button
                  role="switch"
                  aria-checked={settings.highContrast}
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`a11y-switch ${settings.highContrast ? 'active' : ''}`}
                >
                  <span className="a11y-switch-thumb" />
                </button>
              </label>
            </div>

            {/* Dyslexia Font */}
            <div className="a11y-option">
              <label className="a11y-toggle-label">
                <span className="a11y-label"><Translated>Dyslexia-Friendly Font</Translated></span>
                <button
                  role="switch"
                  aria-checked={settings.dyslexiaFont}
                  onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                  className={`a11y-switch ${settings.dyslexiaFont ? 'active' : ''}`}
                >
                  <span className="a11y-switch-thumb" />
                </button>
              </label>
            </div>

            {/* Reduced Motion */}
            <div className="a11y-option">
              <label className="a11y-toggle-label">
                <span className="a11y-label"><Translated>Reduce Motion</Translated></span>
                <button
                  role="switch"
                  aria-checked={settings.reducedMotion}
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`a11y-switch ${settings.reducedMotion ? 'active' : ''}`}
                >
                  <span className="a11y-switch-thumb" />
                </button>
              </label>
            </div>

            {/* Reset Button */}
            <button onClick={resetSettings} className="a11y-reset">
              <Translated>Reset to Default</Translated>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
