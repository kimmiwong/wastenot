import { Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import WasteNotLogo from '../assets/WasteNotLogo.png';
import classes from './Header.module.css';

export default function SimpleHeader() {
    return (
        <Box>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <div className={classes.leftSection}>
                        <img src={WasteNotLogo} alt="WasteNot Logo" className={classes.logo} />
                        <span className={classes.logoText}>WasteNot</span>
                    </div>

                    <Link to="/" className={classes.link} size="md" weight={500}>
                        Home
                    </Link>
                </div>
            </header>
        </Box>
    );
}
