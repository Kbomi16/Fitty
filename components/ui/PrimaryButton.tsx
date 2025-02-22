import React, { ReactNode, useMemo } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/contexts/ThemeProvider'
import { ThemeType } from '@/utils/theme'

type PrimaryButtonProps = {
  children: ReactNode
  onPress: () => void
}

export default function PrimaryButton({
  children,
  onPress,
}: PrimaryButtonProps) {
  const theme = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  )
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    button: {
      width: '100%',
      maxWidth: 300,
      paddingVertical: 14,
      borderRadius: 100,
      marginTop: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: theme.buttonBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  })
