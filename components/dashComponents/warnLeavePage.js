import { useEffect } from 'react';
import Router from 'next/router';

export default function useWarnIfUnsavedChanges(message) {

    useEffect(() => {
        const routeChangeStart = url => {
            if (Router.asPath !== url && !confirm(message)) {
                Router.events.emit('routeChangeError');
                Router.replace(Router, Router.asPath);
                throw 'Abort route change. Please ignore this error.';
            }
        };

        const beforeunload = e => {

            e.preventDefault();
            e.returnValue = message;
            return message;

        };

        window.addEventListener('beforeunload', beforeunload);
        Router.events.on('routeChangeStart', routeChangeStart);

        return () => {
            window.removeEventListener('beforeunload', beforeunload);
            Router.events.off('routeChangeStart', routeChangeStart);
        };
    }, []);
};