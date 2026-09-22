import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from '../ui/AppText';

import { Colors } from '@/constants/theme';

export default function CurrentWeather() {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 375;

    return (
        <View style={[styles.container]}>

            {/* backgroundimage */}
            <Image
                source={isSmallScreen ? require('@/assets/images/bg-today-small.svg') : require('@/assets/images/bg-today-large.svg')}
                contentFit="cover"
                accessibilityLabel="Weather Now"
                style={StyleSheet.absoluteFill}
                accessible={false}
            />
            
            <View style={isSmallScreen ? styles.column : styles.row}>
                <View style={styles.textCenter}>
                    <AppText>
                        current weather
                    </AppText>
                    <AppText style={{ color: Colors.textSecondary }}>
                        current weather
                    </AppText>
                </View>
                <View style={styles.row}>
                    <Image
                        source={require('@/assets/images/icon-sunny.webp')}
                        style={[styles.image, { aspectRatio: 1 }]}
                        contentFit="contain"
                        accessibilityLabel="Weather Now"
                    />
                    <AppText style={{ fontSize: 40 }}>
                        20°
                    </AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCenter: {
        alignItems: 'center',
    },
    container: {
        padding: 16,
        borderRadius: 12,
        overflow: 'hidden',
        paddingVertical: 50,
    },
    image: {
        zIndex: 10,
        width: 70,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
