// src/components/TeamSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Linkedin, Send, Link as LinkIcon, Mail } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TeamMember, teamService } from "@/app/api/team/route";
import AnimatedImage from "../ui/AnimatedImage";

interface TeamSectionProps {
    locale: string;
}

export default function TeamSection({ locale }: TeamSectionProps) {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await teamService.getTeam(locale);
                setTeam(data.results);
            } catch (error) {
                console.error("Failed to fetch team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [locale]);

    const handleMemberClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        // Delay clearing selected member until animation completes
        setTimeout(() => setSelectedMember(null), 200);
    };

    if (loading) {
        return (
            <section className="py-20 px-4 bg-gradient-to-b">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-900" />
                                <div className="mt-4 h-6 rounded w-3/4 bg-gray-200 dark:bg-gray-950" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {team.map((member, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleMemberClick(member)}
                            className="group cursor-pointer "
                        >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl">
                                <div className="relative overflow-hidden">
                                    <AnimatedImage
                                        src={member.image}
                                        alt={member.full_name}
                                        objectFit="cover"
                                        className="rounded-2xl w-full"
                                    />
                                </div>

                                <div className="p-6 dark:bg-gray-800">
                                    <h3 className="text-xl font-bold group-hover:underline decoration-2 underline-offset-4 decoration-blue-500 transition-all">
                                        {member.full_name}
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
                    {selectedMember && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-6">
                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                        <AnimatedImage
                                            src={selectedMember.image}
                                            alt={selectedMember.full_name}
                                            height="h-32"
                                            objectFit="cover"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <DialogTitle className="text-2xl font-bold leading-tight">
                                            {selectedMember.full_name}
                                        </DialogTitle>
                                        <p className="text-blue-600 font-medium mt-1">
                                            {selectedMember.role}
                                        </p>
                                    </div>
                                </div>
                            </DialogHeader>

                            <DialogDescription className="leading-relaxed mt-4 text-base">
                                {selectedMember.description}
                            </DialogDescription>

                            <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                                <h4 className="font-semibold leading-tight mb-2">Aloqa</h4>

                                {selectedMember.email && (
                                    <a
                                        href={`mailto:${selectedMember.email}`}
                                        className="flex items-center gap-3 hover:text-blue-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{selectedMember.email}</span>
                                    </a>
                                )}

                                {selectedMember.linked_in_link && (
                                    <a
                                        href={selectedMember.linked_in_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 hover:text-blue-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Linkedin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium">LinkedIn</span>
                                    </a>
                                )}

                                {selectedMember.telegram_username && (
                                    <a
                                        href={`https://t.me/${selectedMember.telegram_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 hover:text-blue-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Send className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium">@{selectedMember.telegram_username}</span>
                                    </a>
                                )}

                                {selectedMember.extra_contact_link && (
                                    <a
                                        href={selectedMember.extra_contact_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <LinkIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium">Qo'shimcha havola</span>
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}