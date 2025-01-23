import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  color?: string;
}

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, color, ...otherProps } = props;
  const colorScheme = useColorScheme();
  
  const textColor = color || (colorScheme === 'dark' ? darkColor ?? '#fff' : lightColor ?? '#1d1d1f');

  return (
    <Text 
      style={[
        { 
          color: textColor,
          fontFamily: 'SF-Pro-Display-Regular'
        },
        style
      ]} 
      {...otherProps} 
    />
  );
}
