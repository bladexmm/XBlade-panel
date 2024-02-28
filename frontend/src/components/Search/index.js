import * as React from 'react';
import {Transition} from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Input from '@mui/joy/Input';
import "./index.css"

export default function Search({open, onClose = () => {}, onSearchInput = () => {}, children
                               }) {
    return (
        <Transition in={open} timeout={400}>
            {(state) => (
                <Modal
                    keepMounted
                    open={!['exited', 'exiting'].includes(state)}
                    onClose={onClose}
                    slotProps={{
                        backdrop: {
                            sx: {
                                opacity: 0,
                                backdropFilter: 'none',
                                transition: `opacity 400ms, backdrop-filter 400ms`,
                                ...{
                                    entering: {opacity: 1, backdropFilter: 'blur(8px)'},
                                    entered: {opacity: 1, backdropFilter: 'blur(8px)'},
                                }[state],
                            },
                        },
                    }}
                    sx={{
                        visibility: state === 'exited' ? 'hidden' : 'visible',
                    }}
                >
                    <ModalDialog
                        sx={{
                            opacity: 0,
                            width:"80%",
                            height:"80%",
                            transition: `opacity 300ms`,
                            ...{
                                entering: {opacity: 1},
                                entered: {opacity: 1},
                            }[state],
                        }}
                    >
                        <DialogTitle>
                            <Input
                                placeholder="搜索"
                                variant="plain"
                                onChange={(event) => {
                                    onSearchInput(event.target.value)
                                }}
                                sx={{
                                    '--Input-radius': '0px',
                                    borderBottom: '2px solid',
                                    borderColor: 'neutral.outlinedBorder',
                                    width: "100%",
                                    '&:hover': {
                                        borderColor: 'neutral.outlinedHoverBorder',
                                    },
                                    '&::before': {
                                        border: '1px solid var(--Input-focusedHighlight)',
                                        transform: 'scaleX(0)',
                                        left: 0,
                                        right: 0,
                                        bottom: '-2px',
                                        top: 'unset',
                                        transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                        borderRadius: 0,
                                    },
                                    '&:focus-within::before': {
                                        transform: 'scaleX(1)',
                                    },
                                }}
                            /></DialogTitle>
                        <DialogContent className="search">
                            {children}
                        </DialogContent>
                    </ModalDialog>
                </Modal>
            )}
        </Transition>
    );
}