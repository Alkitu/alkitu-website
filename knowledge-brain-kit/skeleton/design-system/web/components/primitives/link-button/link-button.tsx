import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "~/components/primitives/button";
import { cn } from "~/lib/utils";

export interface LinkButtonProps extends ButtonProps {
    href: string;
    external?: boolean;
}

function LinkButton({
    href,
    external = false,
    children,
    className,
    variant = "link",
    ref,
    ...props
}: LinkButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
    return (
        <Button
            ref={ref}
            variant={variant}
            className={cn("gap-1", className)}
            asChild
            {...props}
        >
            <a
                href={href}
                {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
            >
                {children}
                {external && <ExternalLink className="size-3" />}
            </a>
        </Button>
    );
}

LinkButton.displayName = "LinkButton";

export { LinkButton };
