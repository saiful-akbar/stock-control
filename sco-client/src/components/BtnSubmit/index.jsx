import React from 'react';
import {
    Button,
    CircularProgress,
} from '@material-ui/core';

const BtnSubmit = ({
    title,
    loading,
    handleSubmit,
    handleCancel,
    titleCancel,
    size,
    color,
    singleButton,
    ...props
}) => {

    /**
     * button on proccess
     */
    const btnOnProcess = () => {
        return (
            <Button
                disabled={true}
                color={color}
                size={size}
            >
                <CircularProgress
                    size={20}
                    color='inherit'
                    style={{ marginRight: 10 }}
                />
                Processing...
            </Button>
        );
    };

    /**
     * button active
     */
    const btnActive = () => {
        return (
            <>
                {!singleButton && (
                    <Button
                        onClick={handleCancel}
                        color={color}
                        size={size}
                    >{titleCancel}</Button>
                )}

                <Button
                    onClick={handleSubmit}
                    size={size}
                    color={color}
                    {...props}
                > {title} </Button>
            </>
        );
    }

    return loading ? btnOnProcess() : btnActive();
};

/**
 * Deault props
 */
BtnSubmit.defaultProps = {
    title: '',
    titleCancel: 'Cancel',
    size: 'medium',
    color: 'primary',
    loading: false,
    singleButton: false,
};

export default BtnSubmit;