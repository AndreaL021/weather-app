import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';

import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

export function WeatherLoadingMain() {


    const [dots] = useState(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

    useEffect(() => {
        // animazione caricamento
        const animation = Animated.loop(Animated.stagger(200, dots.map(dot => Animated.sequence([
            Animated.timing(dot, { toValue: -6, duration: 200, useNativeDriver: Platform.OS !== 'web', isInteraction: false }),
            Animated.timing(dot, { toValue: 0, duration: 200, useNativeDriver: Platform.OS !== 'web', isInteraction: false }),
        ]))));
        animation.start();
        return () => animation.stop();
    }, [dots]);

    const { width } = useWindowDimensions();
    const columns = width < 375 ? 3 : width < 576 ? 4 : 7;
    const rows = Array.from({ length: Math.ceil(7 / columns) }, (_, row) =>
        Array.from({ length: Math.min(columns, 7 - row * columns) }, (_, column) => row * columns + column));

    return (
        <>
            <View style={[styles.current, width < 400 && styles.currentMobile]} accessibilityState={{ busy: true }}>

                <View style={styles.dots} accessible={false}>

                    {dots.map((dot, index) => <Animated.View key={index} style={[styles.dot, { transform: [{ translateY: dot }] }]} />)}

                </View>

                <AppText accessibilityLiveRegion="polite">Loading…</AppText>

            </View>

            <View style={styles.details}>

                {['Feels Like', 'Humidity', 'Wind', 'Precipitation'].map(label => (

                    <View key={label} style={[styles.detail, width < 576 && styles.detailMobile]}>

                        <AppText color="textMuted">{label}</AppText>

                        <AppText style={styles.value}>–</AppText>

                    </View>

                ))}
            </View>

            <View style={styles.daily}>

                <AppText size='header' style={styles.title}>Daily forecast</AppText>

                {
                    rows.map((row, index) => (

                        <View key={index} style={styles.dayRow}>

                            {row.map(day => <View key={day} style={styles.day} />)}

                            {/* Mantiene la larghezza delle card anche nell'ultima riga incompleta. */}
                            {Array.from({ length: columns - row.length }, (_, empty) => <View key={`empty-${empty}`} style={styles.emptyDay} />)}

                        </View>
                    ))
                }
            </View>
        </>
    );
}

export function WeatherLoadingHourly({ fillHeight }: { fillHeight: boolean }) {


    return (

        <View style={[styles.hourly, fillHeight && styles.fill]}>

            <View style={styles.header}>

                <AppText size='header' style={styles.title}>Hourly forecast</AppText>

                {/* Segnaposto non interattivo: i giorni saranno disponibili dopo il caricamento. */}
                <View style={styles.daySelector}>

                    <AppText>–</AppText>

                    <Image source={require('@/assets/images/icon-dropdown.svg')} style={styles.arrow} contentFit="contain" accessible={false} />

                </View>

            </View>

            <View style={[styles.hours, fillHeight && styles.fill]}>

                {Array.from({ length: 8 }, (_, hour) => <View key={hour} style={[styles.hour, fillHeight && styles.fill]} />)}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    current: {
        minHeight: 180,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    currentMobile: {
        minHeight: 260,
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 14,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: Colors.textSecondary,
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    detail: {
        width: '24%',
        padding: 10,
        borderRadius: 8,
        backgroundColor: Colors.surface,
    },
    detailMobile: {
        width: '48%',
    },
    value: {
        marginTop: 15,
        fontSize: 16,
    },
    title: {
        flexShrink: 1,
    },
    daily: {
        gap: 10,
    },
    dayRow: {
        flexDirection: 'row',
        gap: 10,
    },
    day: {
        flex: 1,
        height: 122,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    emptyDay: {
        flex: 1,
    },
    hourly: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    daySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.border,
    },
    arrow: {
        width: 10,
        height: 10,
    },
    hours: {
        gap: 8,
    },
    hour: {
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.surfaceRaised,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    fill: {
        flex: 1,
        minHeight: 0,
    },
});
