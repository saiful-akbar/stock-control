import React from 'react';
import {
    Zoom,
    Fade,
    Grow,
    Slide,
    Collapse,
} from '@material-ui/core';

const Animation = ({ timeout, type, ...props }) => {

    switch (type) {
        case 'fade':
            return (
                <Fade in={true} timeout={timeout} {...props}>
                    <div>                        
                        {props.children}
                    </div>
                </Fade>
            );

        case 'zoom':
            return (
                <Zoom in={true} timeout={timeout} {...props}>
                    <div>
                        {props.children}
                    </div>
                </Zoom>
            );

        case 'slide':
            return (
                <Slide in={true} timeout={timeout} {...props}>
                    <div>
                        {props.children}
                    </div>
                </Slide>
            );

        case 'collapse':
            return (
                <Collapse in={true} timeout={timeout} {...props}>
                    <div>
                        {props.children}
                    </div>
                </Collapse>
            );

        default:
            return (
                <Grow in={true} timeout={timeout} {...props}>
                    <div>
                        {props.children}
                    </div>
                </Grow>
            );
    }
};

Animation.defaultProps = {
    timeout: 500,
    type: 'grow'
};

export default Animation;