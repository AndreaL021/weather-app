import { Colors } from '@/constants/theme';
import { createContext, type ReactNode, type RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StyleSheet, View, type GestureResponderEvent, useWindowDimensions } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number };
type Menu = {
    id: string;
    anchor: Rect;
    triggerRef: RefObject<View | null>;
    width: number;
    renderContent: (close: () => void) => ReactNode;
};
type OpenMenu = Menu & { viewportWidth: number; viewportHeight: number };
type SelectContextValue = {
    activeId: string | null;
    openMenu: (menu: Menu) => void;
    closeMenu: () => void;
};
const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectMenu() {
    const context = useContext(SelectContext);
    if (!context) throw new Error('Select deve essere dentro SelectProvider.');
    return context;
}

// Sul web i ref delle View puntano a elementi DOM.
function containsTarget(ref: RefObject<View | null>, target: EventTarget | null) {
    const element = ref.current as unknown as HTMLElement | null;
    return target instanceof Node && !!element?.contains(target);
}

export default function SelectProvider({ children }: { children: ReactNode }) {
    const [menu, setMenu] = useState<OpenMenu | null>(null);
    const rootRef = useRef<View>(null);
    const menuRef = useRef<View>(null);
    const { width, height } = useWindowDimensions();
    const visibleMenu = menu?.viewportWidth === width && menu.viewportHeight === height ? menu : null;
    const closeMenu = useCallback(() => setMenu(null), []);
    const openMenu = useCallback((next: Menu) => {
        rootRef.current?.measureInWindow((rootX, rootY) => {
            setMenu({ ...next, anchor: { ...next.anchor, x: next.anchor.x - rootX, y: next.anchor.y - rootY }, viewportWidth: width, viewportHeight: height });
        });
    }, [width, height]);

    useEffect(() => {
        if (!visibleMenu) return;
        const back = BackHandler.addEventListener('hardwareBackPress', () => { closeMenu(); return true; });
        if (Platform.OS !== 'web') return () => back.remove();

        const outside = (event: Event) => {
            if (!containsTarget(menuRef, event.target) && !containsTarget(visibleMenu.triggerRef, event.target)) closeMenu();
        };
        const scroll = (event: Event) => {
            if (!containsTarget(menuRef, event.target)) closeMenu();
        };
        const keydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
                visibleMenu.triggerRef.current?.focus();
            }
        };
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('focusin', outside, true);
        document.addEventListener('scroll', scroll, true);
        document.addEventListener('wheel', scroll, true);
        document.addEventListener('keydown', keydown);
        window.addEventListener('blur', closeMenu);
        return () => {
            back.remove();
            document.removeEventListener('pointerdown', outside, true);
            document.removeEventListener('focusin', outside, true);
            document.removeEventListener('scroll', scroll, true);
            document.removeEventListener('wheel', scroll, true);
            document.removeEventListener('keydown', keydown);
            window.removeEventListener('blur', closeMenu);
        };
    }, [visibleMenu, closeMenu]);

    const observeTouch = (event: GestureResponderEvent) => {
        if (Platform.OS !== 'web' && visibleMenu) {
            const { pageX, pageY } = event.nativeEvent;
            const inside = (x: number, y: number, w: number, h: number) => pageX >= x && pageX <= x + w && pageY >= y && pageY <= y + h;
            visibleMenu.triggerRef.current?.measureInWindow((x, y, w, h) => {
                if (inside(x, y, w, h)) return;
                menuRef.current?.measureInWindow((mx, my, mw, mh) => {
                    if (!inside(mx, my, mw, mh)) setMenu(current => current === visibleMenu ? null : current);
                });
            });
        }
        // Osserva il gesto senza sottrarlo alla pagina o ai pulsanti.
        return false;
    };
    const menuWidth = Math.min(visibleMenu?.width ?? 180, width - 24);
    const spaceBelow = visibleMenu ? height - visibleMenu.anchor.y - visibleMenu.anchor.height - 20 : 0;
    const openAbove = !!visibleMenu && spaceBelow < 260 && visibleMenu.anchor.y > spaceBelow;

    return (
        <SelectContext.Provider value={{ activeId: visibleMenu?.id ?? null, openMenu, closeMenu }}>
            <View ref={rootRef} collapsable={false} style={styles.root} onStartShouldSetResponderCapture={observeTouch} onLayout={closeMenu}>
                {children}
                {visibleMenu && (
                    <View style={styles.layer}>
                        <View ref={menuRef} collapsable={false} style={[styles.menu, {
                            width: menuWidth,
                            left: Math.max(12, Math.min(visibleMenu.anchor.x + visibleMenu.anchor.width - menuWidth, width - menuWidth - 12)),
                            maxHeight: Math.max(44, openAbove ? visibleMenu.anchor.y - 20 : spaceBelow),
                            ...(openAbove ? { bottom: height - visibleMenu.anchor.y + 8 } : { top: visibleMenu.anchor.y + visibleMenu.anchor.height + 8 }),
                        }]}>
                            {visibleMenu.renderContent(closeMenu)}
                        </View>
                    </View>
                )}
            </View>
        </SelectContext.Provider>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    // Questo livello serve solo a disegnare il menu; lo spazio vuoto lascia passare i tocchi.
    layer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'box-none', zIndex: 10 },
    menu: { position: 'absolute', padding: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
});
