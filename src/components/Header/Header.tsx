import useBreakpoints from '@/hooks/useBreakpoints';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Select from '../ui/Select';
import DropdownMenu from './DropdownMenu';

export default function Header() {

    const { isSmallScreen, isMediumScreen, isLargeScreen, isXLScreen, isXXLScreen } = useBreakpoints();

    return (
        <View style={[styles.container, {
            width: isMediumScreen ? '100%' : isLargeScreen ? '90%' : isXLScreen ? '100%' : isXXLScreen ? '70%' : '90%'
        }]}>

            <View style={styles.row}>

                {/* logo */}
                <View style={[styles.logoContainer, { width: isSmallScreen ? 150 : 200 }]}>

                    <Image
                        source={require('@/assets/images/logo.svg')}
                        style={{ height: 60 }}
                        contentFit="contain"
                        accessibilityLabel="Weather Now"
                    />

                </View>

                {/* select */}
                <Select
                    label="Units"
                    accessibilityLabel="Measurement units"
                    icon={require('@/assets/images/icon-units.svg')}
                    menuWidth={isMediumScreen ? 240 : 300}
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
        alignSelf: 'center',
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
    },
});
