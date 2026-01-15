'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface TranslatedProps {
  children: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export default function Translated({ children, as: Component = 'span', className }: TranslatedProps) {
  const { language, translate } = useLanguage()
  const [translatedText, setTranslatedText] = useState(children)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (language === 'en') {
      setTranslatedText(children)
      return
    }

    let cancelled = false
    setIsLoading(true)

    translate(children).then((result) => {
      if (!cancelled) {
        setTranslatedText(result)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [children, language, translate])

  return (
    <Component className={className} style={{ opacity: isLoading ? 0.7 : 1 }}>
      {translatedText}
    </Component>
  )
}
