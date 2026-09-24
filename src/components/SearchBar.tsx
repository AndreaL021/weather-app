import { Colors, Fonts, FontSizes } from '@/constants/theme';
import { useWeather } from '@/contexts/WeatherContext';
import useBreakpoints from '@/hooks/useBreakpoints';
import { cityLabel, searchCities, type City } from '@/services/citySearch';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import type { TextStyle } from 'react-native';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppText from './ui/AppText';
import InteractivePressable, { focusStyle } from './ui/InteractivePressable';

// Proprietà CSS applicate solo all'input web per rimuovere 
// contorno input di default quando si attiva il focus
const webInputStyle = {
    outlineStyle: 'none' as const,
    caretColor: Colors.text,
} as unknown as TextStyle;

export default function SearchBar() {

    const [inputHovered, setInputHovered] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalReady, setModalReady] = useState(false);

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [searchAttempt, setSearchAttempt] = useState(0);
    const [highlighted, setHighlighted] = useState(0);
    const [result, setResult] = useState<{ query: string; cities: City[]; error: boolean } | null>(null);


    const { selectCity } = useWeather();

    const { isSmallScreen, isMediumScreen, isXLScreen } = useBreakpoints();

    const useSearchModal = Platform.OS !== 'web' || isSmallScreen;


    const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<TextInput>(null);
    const term = query.trim();
    const showResults = open && (!useSearchModal || modalOpen) && term.length >= 2;
    const searching = showResults && result?.query !== term;

    const cities = result?.query === term ? result.cities : [];

    useEffect(() => () => {
        if (blurTimer.current) clearTimeout(blurTimer.current);
    }, []);

    useEffect(() => {
        if (!useSearchModal || !modalOpen || !modalReady) return;

        // A ogni apertura aspetta che la finestra del modal sia pronta per la tastiera.
        const timer = setTimeout(() => {
            inputRef.current?.blur();
            inputRef.current?.focus();
        }, 150);

        return () => clearTimeout(timer);
    }, [useSearchModal, modalOpen, modalReady]);

    useEffect(() => {

        if (!showResults) return;

        let active = true;

        const controller = new AbortController();

        let timeout: ReturnType<typeof setTimeout>;

        // Aspetta una breve pausa nella digitazione e annulla le ricerche superate.
        const debounce = setTimeout(() => {

            timeout = setTimeout(() => controller.abort(), 8000);

            searchCities(term, controller.signal).then(cities => {

                if (active) setResult({ query: term, cities, error: false });

            }).catch(() => {

                if (active) setResult({ query: term, cities: [], error: true });

            }).finally(() => clearTimeout(timeout));

        }, 350);

        return () => {
            active = false;
            clearTimeout(debounce);
            clearTimeout(timeout);
            controller.abort();
        };

    }, [term, showResults, searchAttempt]);

    const closeSearch = () => {

        if (blurTimer.current) clearTimeout(blurTimer.current);

        inputRef.current?.blur();

        setOpen(false);
        setModalOpen(false);
        setModalReady(false);
        setInputFocused(false);
        Keyboard.dismiss();
    };

    const openSearch = () => {

        if (blurTimer.current) clearTimeout(blurTimer.current);

        setModalReady(false);
        setModalOpen(true);
        setOpen(true);
    };

    const chooseCity = (city: City) => {
        closeSearch();
        setQuery(cityLabel(city));
        setResult(null);
        inputRef.current?.blur();
        Keyboard.dismiss();
        selectCity(city);
    };

    const submit = () => {

        if (blurTimer.current) clearTimeout(blurTimer.current);

        if (cities.length) {

            chooseCity(cities[highlighted] ?? cities[0]);

        } else {
            setResult(null);
            setOpen(true);
            setSearchAttempt(value => value + 1);
            inputRef.current?.focus();
        }
    };

    const searchButton = (
        <InteractivePressable
            showFocusOutline={false}
            accessibilityRole="button"
            accessibilityLabel="Search"
            onPress={submit}
            hoverStyle={styles.buttonHover}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
            <AppText>Search</AppText>
        </InteractivePressable>
    );

    // Riutilizza lo stesso campo e gli stessi risultati nel modal e nella pagina desktop.
    const searchForm = (
        <View
            style={[
                styles.row,
                useSearchModal
                    ? styles.modalForm : isMediumScreen
                        ? styles.mobileRow : styles.desktopRow,
                { width: isMediumScreen ? "100%" : isXLScreen ? '70%' : '50%' }
            ]}
        >

            {/* pulsante mobile */}
            {!useSearchModal && isMediumScreen && searchButton}

            <View style={[styles.inputColumn, !useSearchModal && !isSmallScreen && styles.desktopInput]}>
                <View
                    onPointerEnter={() => setInputHovered(true)}
                    onPointerLeave={() => setInputHovered(false)}
                    style={[styles.container, inputHovered && styles.inputHover, inputFocused && focusStyle]}
                >

                    <Image
                        contentFit="contain"
                        source={require('@/assets/images/icon-search.svg')}
                        style={styles.magnify}
                        accessible={false}
                    />

                    {/* INPUT */}
                    <TextInput
                        ref={inputRef}
                        autoFocus={useSearchModal && Platform.OS === 'web'}
                        value={query}
                        onChangeText={text => {
                            setQuery(text);
                            setResult(null);
                            setHighlighted(0);
                            setOpen(true);
                        }}
                        onSubmitEditing={submit}
                        onKeyPress={event => {
                            const key = event.nativeEvent.key;
                            if (key === 'Escape') closeSearch();
                            if (
                                showResults
                                && cities.length
                                && (key === 'ArrowDown' || key === 'ArrowUp')
                            ) {
                                event.preventDefault();
                                setHighlighted(index => (index + (key === 'ArrowDown' ? 1 : -1) + cities.length) % cities.length);
                            }
                        }}
                        underlineColorAndroid='transparent'
                        style={[styles.text, Platform.OS === 'web' && webInputStyle]}
                        placeholder={inputFocused ? '' : 'Search for a place...'}
                        onFocus={() => {
                            if (blurTimer.current) clearTimeout(blurTimer.current);
                            setInputFocused(true);
                            setOpen(true);
                        }}
                        onBlur={() => {
                            setInputFocused(false);
                            // Lascia completare il click su un suggerimento prima di chiudere la lista.
                            if (!useSearchModal) blurTimer.current = setTimeout(() => setOpen(false), 180);
                        }}
                        placeholderTextColor={Colors.textMuted}
                        accessibilityLabel="City to search for"
                        returnKeyType="search"
                        autoCorrect={false}
                    />

                </View>

                {
                    showResults && (
                        <View style={[styles.results, !useSearchModal && Platform.OS === 'web' && styles.resultsOverlay]}>
                            {
                                searching ? (

                                    <View style={styles.searchStatus}>
                                        <LoadingIcon />
                                        <AppText accessibilityLiveRegion="polite">Search in progress</AppText>
                                    </View>

                                ) : result?.error ? (

                                    <AppText style={styles.resultMessage} accessibilityLiveRegion="polite">Unable to search. Try again.</AppText>

                                ) : cities.length === 0 ? (

                                    <AppText style={styles.resultMessage} accessibilityLiveRegion="polite">No cities found.</AppText>

                                ) : cities.map((city, index) => (

                                    <InteractivePressable
                                        insetOutline
                                        key={city.id}
                                        onPress={() => chooseCity(city)}
                                        onFocus={() => {
                                            if (blurTimer.current) clearTimeout(blurTimer.current);
                                            setHighlighted(index);
                                        }}
                                        onBlur={() => {
                                            if (!useSearchModal) blurTimer.current = setTimeout(() => setOpen(false), 180);
                                        }}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Show weather for ${cityLabel(city)}`}
                                        style={({ pressed }) => [styles.result, index === highlighted && styles.resultHighlighted, pressed && styles.resultPressed]}
                                    >
                                        <AppText>{cityLabel(city)}</AppText>
                                    </InteractivePressable>
                                ))
                            }
                        </View>
                    )
                }
            </View>

            {/* pulsante desktop */}
            {!useSearchModal && !isMediumScreen && searchButton}
        </View>
    );


    // return searchform senza modal su schermi grandi
    if (!useSearchModal) return searchForm;

    // mobile
    return (
        <>
            <View style={[
                styles.row,
                isMediumScreen ? styles.mobileRow : styles.desktopRow,
                { width: isMediumScreen ? "100%" : isXLScreen ? '70%' : '50%' }
            ]}
            >

                <InteractivePressable
                    onPress={openSearch}
                    accessibilityRole="button"
                    accessibilityLabel="Open city search"
                    style={[styles.container, styles.searchTrigger, !isSmallScreen && styles.desktopInput]}
                >

                    <Image source={require('@/assets/images/icon-search.svg')} style={styles.magnify} contentFit="contain" accessible={false} />

                    <AppText color='textMuted' numberOfLines={1}>{query || 'Search for a place...'}</AppText>

                </InteractivePressable>

            </View>

            {/* modal */}
            <Modal
                visible={modalOpen}
                animationType="slide"
                presentationStyle="fullScreen"
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={closeSearch}
                onShow={() => setModalReady(true)}
            >

                <SafeAreaProvider>

                    <SafeAreaView style={styles.modalScreen}>

                        <KeyboardAvoidingView style={styles.modalBody} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                            <View style={styles.modalHeader}>

                                <AppText
                                    accessibilityRole="header"
                                    size='title'
                                    style={styles.modalTitle}
                                >Search for a place</AppText>

                                <InteractivePressable
                                    onPress={closeSearch}
                                    accessibilityRole="button"
                                    accessibilityLabel="Close city search"
                                    style={styles.closeButton}
                                >

                                    <AppText style={styles.closeIcon}>×</AppText>

                                </InteractivePressable>

                            </View>
                            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalContent}>

                                {searchForm}

                            </ScrollView>

                        </KeyboardAvoidingView>

                    </SafeAreaView>

                </SafeAreaProvider>

            </Modal>
        </>
    );
}


function LoadingIcon() {

    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setStep(current => (current + 1) % 8), 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={{ transform: [{ rotate: `${step * 45}deg` }] }}>
            <Image
                source={require('@/assets/images/icon-loading.svg')}
                style={styles.loadingIcon}
                contentFit="contain"
                accessible={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modalScreen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalBody: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
    },
    modalTitle: {
        flexShrink: 1,
    },
    closeButton: {
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    closeIcon: {
        fontSize: 40,
    },
    modalContent: {
        padding: 10,
        paddingHorizontal: 20,
    },
    modalForm: {
        width: '100%',
        marginTop: 0,
    },
    searchTrigger: {
        minHeight: 44,
    },
    row: {
        zIndex: 3,
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    mobileRow: {
        flexDirection: 'column',
    },
    desktopRow: {
        minWidth: 350,
        flexDirection: 'row',
    },
    container: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 10,
        backgroundColor: Colors.surface,
        borderRadius: 8,
    },
    desktopInput: {
        flex: 1,
        minWidth: 0,
    },
    inputColumn: {
        minWidth: 0,
        zIndex: 1,
    },
    results: {
        marginTop: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    resultsOverlay: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
    result: {
        minHeight: 40,
        justifyContent: 'center',
        padding: 10,
        borderRadius: 6,
    },
    resultHighlighted: {
        backgroundColor: Colors.surfaceRaised,
    },
    resultPressed: {
        backgroundColor: 'hsl(243, 27%, 16%)',
    },
    resultMessage: {
        padding: 10,
    },
    searchStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 8,
    },
    loadingIcon: {
        width: 16,
        height: 16,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 10,
        paddingHorizontal: 16,
    },
    buttonPressed: {
        backgroundColor: Colors.primaryDark,
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: Colors.primary,
        outlineOffset: 3,
        transform: [{
            scale: 0.97
        }],
    },
    buttonHover: {
        backgroundColor: 'hsl(233, 67%, 62%)'
    },
    inputHover: {
        backgroundColor: Colors.surfaceRaised
    },
    text: {
        flex: 1,
        minWidth: 0,
        color: Colors.text,
        fontFamily: Fonts.body,
        fontSize: FontSizes.medium,
    },
    magnify: {
        width: 15,
        height: 15,
        flexShrink: 0,
    },
});
