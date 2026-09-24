import { Breakpoints } from '@/constants/theme';
import { useWindowDimensions } from 'react-native';

export default function useBreakpoints() {
    const { width } = useWindowDimensions();

    
    return {
        isXSScreen: width < Breakpoints.xs,
        isSmallScreen: width < Breakpoints.small,
        isMediumScreen: width < Breakpoints.medium,
        isLargeScreen: width < Breakpoints.large,
        isXLScreen: width < Breakpoints.xl,
        isXXLScreen: width > Breakpoints.xxl,
    };
}
