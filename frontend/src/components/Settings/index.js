import React from 'react';
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogContent from '@mui/joy/DialogContent';
import TabsSettings from "./Tabs";

export default function SettingsDialog({ open, onClose, children }) {
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
                                    entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    entered: { opacity: 1, backdropFilter: 'blur(8px)' },
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
                            transition: `opacity 300ms`,
                            ...{
                                entering: { opacity: 1 },
                                entered: { opacity: 1 },
                            }[state],
                        }}
                    >
                        <DialogContent>
                            <TabsSettings> {children}</TabsSettings>
                        </DialogContent>
                    </ModalDialog>
                </Modal>
            )}
        </Transition>
    );
}
