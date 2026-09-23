import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import { StyleSheet, View, useWindowDimensions } from 'react-native';



export default function WeatherDetails() {
    const { temperature, wind, precipitation } = useUnits();

    const { width } = useWindowDimensions();
    const { data } = useWeather();
    const isMediumScreen = width < 576;

    if (!data) return null;

    const current = data.weather.current;


    return (

        <View style={[styles.container, isMediumScreen && styles.grid]}>

            <View style={[styles.card, isMediumScreen && styles.gridCard]}>

                <AppText style={{ color: Colors.textMuted }}>

                    Feels Like

                </AppText>

                <AppText style={{marginTop: 15, fontSize: 16}}>
                    
                    {temperature(current.apparent_temperature, true)}

                </AppText>

            </View>

            <View style={[styles.card, isMediumScreen && styles.gridCard]}>

                <AppText style={{ color: Colors.textMuted }}>

                    Humidity

                </AppText>

                <AppText style={{marginTop: 15, fontSize: 16}}>

                    {current.relative_humidity_2m}%

                </AppText>

            </View>

            <View style={[styles.card, isMediumScreen && styles.gridCard]}>

                <AppText style={{ color: Colors.textMuted }}>

                    Wind

                </AppText>

                <AppText style={{marginTop: 15, fontSize: 16}}>

                    {wind(current.wind_speed_10m)}

                </AppText>

            </View>

            <View style={[styles.card, isMediumScreen && styles.gridCard]}>

                <AppText style={{ color: Colors.textMuted }}>

                    Precipitation

                </AppText>
                <AppText style={{marginTop: 15, fontSize: 16}}>

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
