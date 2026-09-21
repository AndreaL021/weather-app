import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherDetails from './WeatherDetails';


import { StyleSheet, View, useWindowDimensions } from 'react-native';



export default function WeatherOverview() {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    return (
        <View style={[styles.row, isSmallScreen ? styles.mobileRow : styles.desktopRow]}>
            <CurrentWeather />
            <WeatherDetails />
            <DailyForecast />
            <HourlyForecast />
        </View>
    );
}


const styles = StyleSheet.create({
    row: {
        marginTop: 32,
        alignSelf: 'center',
        gap: 12,
        display: 'flex',
        flexDirection: 'column',
    },
    mobileRow: {
        width: '100%',
    },
    desktopRow: {
        width: '90%',
    },
});