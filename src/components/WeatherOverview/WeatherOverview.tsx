import useBreakpoints from '@/hooks/useBreakpoints';
import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherDetails from './WeatherDetails';
import { WeatherLoadingHourly, WeatherLoadingMain } from './WeatherLoading';

import { StyleSheet, View } from 'react-native';


export default function WeatherOverview({ loading = false }: { loading?: boolean }) {

    const { isMediumScreen, isLargeScreen, isXLScreen, isXXLScreen } = useBreakpoints()
    return (
        <View style={[
            styles.container,
            isLargeScreen ? styles.mobile : styles.desktop,
            {
                width: isMediumScreen ? '100%' : isLargeScreen ? '90%' : isXLScreen ? '100%' : isXXLScreen ? '70%' : '90%'
            }
        ]}
        >

            <View style={[styles.main, !isLargeScreen && styles.mainDesktop]}>

                {            // schermata caricamento
                    loading ? <WeatherLoadingMain /> :
                        <>
                            <CurrentWeather />

                            <WeatherDetails />

                            <DailyForecast />
                        </>
                }

            </View>

            <View style={!isLargeScreen && styles.sidebarDesktop}>

                <View style={!isLargeScreen && StyleSheet.absoluteFill}>

                    {
                        loading
                            ? <WeatherLoadingHourly fillHeight={!isLargeScreen} />
                            : <HourlyForecast fillHeight={!isLargeScreen} />
                    }

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
        flex: 4,
        minWidth: 0,
    },
});
