import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherDetails from './WeatherDetails';


import { StyleSheet, View, useWindowDimensions } from 'react-native';



export default function WeatherOverview() {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 800;
    const isMediumScreen = width < 1000;

    return (
        <View style={[
            styles.container,
            isMediumScreen ? styles.mobile : styles.desktop,
            {
                width: isSmallScreen ? '100%' : isMediumScreen ? '70%' : '80%'
            }
        ]}
        >

            <View style={[styles.main, !isMediumScreen && styles.mainDesktop]}>

                <CurrentWeather />

                <WeatherDetails />

                <DailyForecast />

            </View>

            <View style={!isMediumScreen && styles.sidebarDesktop}>

                <View style={!isMediumScreen && StyleSheet.absoluteFill}>

                    <HourlyForecast fillHeight={!isMediumScreen} />

                </View>

            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignSelf: 'center',
        gap: 15,
    },
    desktop: {
        flexDirection: 'row',
    },
    mobile: {
        flexDirection: 'column',
        paddingBottom: 24,
    },
    main: {
        gap: 12,
    },
    mainDesktop: {
        flex: 7,
        minWidth: 0,
    },
    sidebarDesktop: {
        flex: 3,
        minWidth: 0,
    },
});
