import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import useBreakpoints from '@/hooks/useBreakpoints';
import { StyleSheet, View } from 'react-native';


export default function WeatherDetails() {
    const { temperature, wind, precipitation } = useUnits();

    const { data } = useWeather();
    const { isSmallScreen, isXXLScreen } = useBreakpoints();


    if (!data) return null;

    const current = data.weather.current;


    return (

        <View style={[styles.container, isSmallScreen && styles.grid]}>

            <View style={[styles.card, isSmallScreen && styles.gridCard, isXXLScreen && styles.largeCard]}>

                <AppText color="textMuted">

                    Feels Like

                </AppText>

                <AppText size='title' style={{ marginTop: 10 }}>

                    {temperature(current.apparent_temperature, true)}

                </AppText>

            </View>

            <View style={[styles.card, isSmallScreen && styles.gridCard, isXXLScreen && styles.largeCard]}>

                <AppText color="textMuted">

                    Humidity

                </AppText>

                <AppText size='title' style={{ marginTop: 10 }}>

                    {current.relative_humidity_2m}%

                </AppText>

            </View>

            <View style={[styles.card, isSmallScreen && styles.gridCard, isXXLScreen && styles.largeCard]}>

                <AppText color="textMuted">

                    Wind

                </AppText>

                <AppText size='title' style={{ marginTop: 10 }}>

                    {wind(current.wind_speed_10m)}

                </AppText>

            </View>

            <View style={[styles.card, isSmallScreen && styles.gridCard, isXXLScreen && styles.largeCard]}>

                <AppText color="textMuted">

                    Precipitation

                </AppText>
                <AppText size='title' style={{ marginTop: 10 }}>

                    {precipitation(current.precipitation)}

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
        overflow: 'hidden'
    },
    card: {
        backgroundColor: Colors.surfaceRaised,
        width: '24%',
        borderRadius: 8,
        padding: 10,
        justifyContent: 'space-evenly',
    },
    largeCard: {
        minHeight: 110,
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    grid: {
        flexWrap: 'wrap',
        rowGap: 12,
    },
    gridCard: {
        width: '48%',
    },
});
