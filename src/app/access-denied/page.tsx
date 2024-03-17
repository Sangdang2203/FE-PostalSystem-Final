"use client";

import styles from '../styles/AccessDenied.module.css';
import Link from 'next/link';
import React from 'react';

const App = () => {
    return (
        <div className={styles.container}>
            <h1>Access Denied</h1>
            <p>You are not authorized to access this page.</p>
            <Link href="/" className='text-decoration-none'>
                <p>Go back to the homepage</p>
            </Link>
        </div>
    );
};

export default App;