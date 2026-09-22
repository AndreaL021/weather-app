import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherDetails from './WeatherDetails';


import { StyleSheet, View, useWindowDimensions } from 'react-native';



export default function WeatherOverview() {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;
    const isMediumScreen = width < 768;

    return (
        <View style={[styles.container, isSmallScreen ? styles.mobile : styles.desktop, {width: isSmallScreen ? '100%' : isMediumScreen ? '90%' : '80%'}]}>
            <View style={[styles.main, !isSmallScreen && styles.mainDesktop]}>
                <CurrentWeather />
                <WeatherDetails />
                <DailyForecast />
            </View>
            <View style={!isSmallScreen && styles.sidebarDesktop}>
                <HourlyForecast />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        alignSelf: 'center',
        gap: 15,
    },
    desktop: {
        flexDirection: 'row',
    },
    mobile: {
        flexDirection: 'column',
    },
    main: {
        gap: 12,
    },
    mainDesktop: {
        flex: 7,
        minWidth: 0,
    },
    sidebarDesktop: {
        flex: 4,
        minWidth: 0,
    },
});
