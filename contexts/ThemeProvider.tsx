import { darkTheme, lightTheme, ThemeType } from '@/utils/theme'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'

const ThemeContext = createContext<ThemeType>(lightTheme)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme() // 시스템 테마 감지
  const [theme, setTheme] = useState<ThemeType>(lightTheme)

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme)
  }, [colorScheme])

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
