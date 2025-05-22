import { Box, Anchor } from '@mantine/core';
import WasteNotLogo from '../assets/WasteNotLogo.png';
import classes from './Header.module.css';

export default function SimpleHeader() {
    return (
        <Box pb={20}>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <div className={classes.leftSection}>
                        <img src={WasteNotLogo} alt="WasteNot Logo" className={classes.logo} />
                        <span className={classes.logoText}>WasteNot</span>
                    </div>

                    <Anchor href="#" className={classes.link} size="md" weight={500}>
                        Home
                    </Anchor>
                </div>
            </header>
        </Box>
    );
}
