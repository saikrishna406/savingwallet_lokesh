"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(true)}
            >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5 text-gray-700" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />

                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-xl lg:hidden"
                        >
                            <div className="absolute top-2 right-2 z-50">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-600" />
                                </Button>
                            </div>
                            {/* Force sidebar to take full height and be relative to this container if needed, 
                                but Sidebar has 'fixed' by default. We need to override 'fixed' to 'absolute' or 'static' 
                                if we want it to move with the motion div, OR just let the motion div BE the container.
                                Since Sidebar renders a <nav className='fixed...'>, we need to override 'fixed' to 'static' or 'h-full'.
                                Let's try passing className="static h-full w-full" to override "fixed top-0 left-0".
                             */}
                            <Sidebar className="!static !w-full !h-full !border-none" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
