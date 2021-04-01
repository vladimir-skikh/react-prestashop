import React from 'react';
import style from './Preloader.module.css'
import loader from '../../../img/loader.svg';

let Preloader = () => {
    return (
        <div className={style.preloader}>
            <img
                src={loader}
                alt="Loading..."
                className={style.preloaderImage}
            />
        </div>
    );
};

export default Preloader;
