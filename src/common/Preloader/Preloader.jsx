import React from 'react';
import loader from './../../assets/preloader/load.gif';

let Preloader = props => {
    return (
        <div>
            <img src={loader} alt='load' />
        </div>
    );
};

export default Preloader;
