import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface PageInfoCardProps {
    title: string;
    description: string;
}

export const PageInfoCard: React.FC<PageInfoCardProps> = ({ title, description }) => {
    return (
        <Card className="w-full md:max-w-2xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
};
