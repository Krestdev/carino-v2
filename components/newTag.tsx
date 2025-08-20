import React from 'react'
import { Badge } from './ui/badge';

export interface NewTagProps {
    endNew?: Date;
    positionAbsolute?: boolean;
}
interface BaseProps {
    children: React.ReactNode;
    className?:string;
}

function NewTag({children, endNew, className, positionAbsolute}:NewTagProps & BaseProps) {
    const today = new Date();
    const isNew = endNew ? today <= endNew : false;
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
        {children}
        {isNew && (
            <Badge className={`${positionAbsolute && "absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"} select-none animate-pulse text-[10px] leading-normal uppercase`} variant={"secondary"}>{"nouveau"}</Badge>
        )}
    </div>
  )
}

export default NewTag