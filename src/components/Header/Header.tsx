import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Select from '../ui/Select';
import DropdownMenu from './DropdownMenu';

export default function Header() {

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    return (
        <View style={[styles.container, { paddingHorizontal: isSmallScreen ? 0 : 70 }]}>

            <View style={styles.row}>

                {/* logo */}
                <View style={styles.logoContainer}>

                    <Image
                        source={require('@/assets/images/logo.svg')}
                        style={styles.logo}
                        contentFit="contain"
                        accessibilityLabel="Weather Now"
                    />

                </View>
                
                {/* select */}
                <Select
                    label="Units"
                    accessibilityLabel="Measurement units"
                    icon={require('@/assets/images/icon-units.svg')}
                    menuWidth={240}
                >

                    {/* menu personalizzato units */}
                    <DropdownMenu />

                </Select>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        pointerEvents: 'box-none',
        opacity: 1,
    },
    row: {
        pointerEvents: 'box-none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        pointerEvents: 'none',
        width: 150,
    },
    logo: {
        width: '100%',
        height: 40,
    },
});

