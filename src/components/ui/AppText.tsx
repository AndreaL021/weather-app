// Testo con carattere e dimensioni responsive condivisi tra le pagine.
import { Colors, Fonts, FontSizes, type ThemeColor } from '@/constants/theme';
import useBreakpoints from '@/hooks/useBreakpoints';
import { StyleSheet, Text, type TextProps } from 'react-native';

type AppTextProps = TextProps & {
    size?: 'body' | 'header' | 'title' | 'toast';
    color?: ThemeColor;
};

export default function AppText({ size = 'body', color = 'text', style, ...props }: AppTextProps) {

    const { isSmallScreen, isMediumScreen, isXXLScreen } = useBreakpoints();

    // Tutte le dimensioni si regolano qui: sotto 600, sotto 800 e da 800 in poi.
    const sizes = {
        toast: isMediumScreen ? FontSizes.xs : isXXLScreen ? FontSizes.medium : FontSizes.small,
        body: isMediumScreen ? FontSizes.small : isXXLScreen ? FontSizes.large : FontSizes.medium,
        header: isMediumScreen ? FontSizes.medium : isXXLScreen ? FontSizes.xl : FontSizes.large,
        title: isMediumScreen ? FontSizes.large : isXXLScreen ? FontSizes.xxl : FontSizes.xl,
    };

    return <Text {...props} style={[
        styles.text,
        { fontSize: sizes[size], color: Colors[color] },
        style,
    ]} />;
}

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.body,
    },
});
