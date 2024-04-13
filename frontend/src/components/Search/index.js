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
                            backdropFilter:"blur(30px)",
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            border:"1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow:"None",
                            borderRadius: "2.25rem",
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
                                color="neutral" variant="soft"
                                onChange={(event) => {
                                    onSearchInput(event.target.value)
                                }}
                                sx={{
                                    '--Input-radius': '0px',
                                    borderRadius:"1rem",
                                    width: "100%",
                                    margin:"auto",
                                    '--Input-focusedInset': 'var(--any, )',
                                    '--Input-focusedThickness': '0.25rem',
                                    '--Input-focusedHighlight': 'rgba(13,110,253,.25)',
                                    '&::before': {
                                        transition: 'box-shadow .15s ease-in-out',
                                    },
                                    '&:focus-within': {
                                        borderColor: '#86b7fe',
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