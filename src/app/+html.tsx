import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {

    const basePath = process.env.NODE_ENV === 'development'
    ? ''
    : '/weather-app';


    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <meta name="theme-color" content="#08072D" />

                <link rel="manifest" href={`${basePath}/manifest.json`} />
                <link rel="apple-touch-icon" href={`${basePath}/icon-192.png`} />

                <ScrollViewStyleReset />
            </head>
            <body>{children}</body>
        </html>
    );
}