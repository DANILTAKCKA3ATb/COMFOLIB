import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../../redux/authReducer';
import { useNavigate } from 'react-router-dom';

const pages = [
    { name: 'Home', nav: '/main' },
    { name: 'Search', nav: '/search' },
    { name: 'Bookshelf', nav: '/bookshelf' },
    { name: 'Borrowed', nav: '/borrowed' },
];
const adminPages = [
    { name: 'Books', nav: '/books' },
    { name: 'Libraries', nav: '/libraries' },
    { name: 'Users', nav: '/users' },
];

const Header = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const { isAdmin } = useSelector(state => state.auth);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const navigate = useNavigate();

    const handleOpenUserMenu = event => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Button
                        sx={{
                            my: 0.7,
                            mr: 1,
                            width: '160px',
                            color: 'white',
                            display: 'block',
                        }}
                        onClick={() => {
                            navigate('/main');
                        }}
                    >
                        <Typography
                            variant='h6'
                            noWrap
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            COMFOLIB
                        </Typography>
                    </Button>
                    {isAuthenticated ? (
                        <>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {pages.map(page => (
                                    <Button
                                        key={page.name}
                                        sx={{ my: 2, mr: 1, color: 'white', display: 'block' }}
                                        onClick={() => {
                                            navigate(page.nav);
                                        }}
                                    >
                                        {page.name}
                                    </Button>
                                ))}
                                {isAdmin
                                    ? adminPages.map(page => (
                                          <Button
                                              key={page.name}
                                              variant='contained'
                                              color='secondary'
                                              sx={{ my: 2, mr: 1, color: 'white', display: 'block' }}
                                              onClick={() => {
                                                  navigate(page.nav);
                                              }}
                                          >
                                              {page.name}
                                          </Button>
                                      ))
                                    : null}
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title='Open settings'>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id='menu-appbar'
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key={'account'}>
                                        <Typography textAlign='center' component='a' href='/profile'>
                                            Account
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem key={'logout'} onClick={() => handleLogout()}>
                                        <Typography textAlign='center' component='a' href='/login'>
                                            Logout
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    ) : null}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
