import { Colors, Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from './ui/AppText';
import InteractivePressable from './ui/InteractivePressable';

export default function WeatherError({ onRetry }: { onRetry: () => void }) {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    return (
        <View style={[styles.container, isSmallScreen && styles.compact]} accessibilityLiveRegion="polite">

            <Image
                source={require('../../assets/images/icon-error.svg')}
                style={styles.errorIcon}
                contentFit="contain"
                accessible={false}
            />

            <AppText accessibilityRole="header" style={styles.title}>
                Something went wrong
            </AppText>

            <AppText style={styles.description}>
                We couldn’t connect to the server (API error). Please try again in a few moments.
            </AppText>

            <InteractivePressable
                onPress={onRetry}
                accessibilityRole="button"
                accessibilityLabel="Retry loading weather"
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >

                <Image
                    source={require('../../assets/images/icon-retry.svg')}
                    style={styles.retryIcon}
                    contentFit="contain"
                    accessible={false}
                />

                <AppText style={styles.buttonText}>Retry</AppText>
                
            </InteractivePressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        maxWidth: 720,
        paddingTop: 100,
        paddingBottom: 32,
        gap: 24
    },
    compact: {
        paddingTop: 64
    },
    errorIcon: {
        width: 40,
        height: 40,
    },
    title: {
        fontFamily: Fonts.bodyBold,
        fontSize: 32,
        textAlign: 'center'
    },
    description: {
        maxWidth: 550,
        fontSize: 18,
        color: Colors.textSecondary,
        textAlign: 'center'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: Colors.surface
    },
    buttonPressed: {
        backgroundColor: 'hsl(243, 27%, 16%)'
    },
    retryIcon: {
        width: 16,
        height: 16
    },
    buttonText: {
        fontSize: 14
    },
});
