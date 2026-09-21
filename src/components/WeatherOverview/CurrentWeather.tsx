import AppText from '@/components/ui/AppText';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';


export default function CurrentWeather() {

    return (
        <View style={[styles.container]}>

            <Image
                source={require('@/assets/images/bg-today-large.svg')}
                style={styles.image}
                contentFit="contain"
                accessibilityLabel="Weather Now"
            />
            <AppText>
                Current Weather
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: 200,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});