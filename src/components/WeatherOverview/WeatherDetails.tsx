import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { StyleSheet, View, useWindowDimensions } from 'react-native';



export default function WeatherDetails() {

    const { width } = useWindowDimensions();
    const isMediumScreen = width < 576;


    return (
        <View style={[styles.container, isMediumScreen && styles.grid]}>
            <View style={[styles.card, isMediumScreen && styles.gridCard]}>
                <AppText style={{ color: Colors.textMuted }}>
                    Feels Like
                </AppText>
                <AppText style={{marginTop: 15, fontSize: 16}}>
                    22°C
                </AppText>
            </View>
            <View style={[styles.card, isMediumScreen && styles.gridCard]}>
                <AppText style={{ color: Colors.textMuted }}>
                    Humidity
                </AppText>
                <AppText style={{marginTop: 15, fontSize: 16}}>
                    60%
                </AppText>
            </View>
            <View style={[styles.card, isMediumScreen && styles.gridCard]}>
                <AppText style={{ color: Colors.textMuted }}>
                    Wind
                </AppText>
                <AppText style={{marginTop: 15, fontSize: 16}}>
                    10 km/h
                </AppText>
            </View>
            <View style={[styles.card, isMediumScreen && styles.gridCard]}>
                <AppText style={{ color: Colors.textMuted }}>
                    Precipitation
                </AppText>
                <AppText style={{marginTop: 15, fontSize: 16}}>
                    0 mm
                </AppText>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        display: 'flex',
        // backgroundColor: 'yellow',
        overflow: 'hidden'
    },
    card: {
        backgroundColor: Colors.surfaceRaised,
        width: '24%',
        padding: 10,
        borderRadius: 8,
    },
    grid: {
        flexWrap: 'wrap',
        rowGap: 12,
    },
    gridCard: {
        width: '48%',
    },
});
