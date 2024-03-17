import { createTheme } from "@mui/material/styles";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

const LinkBehaviour = forwardRef<HTMLAnchorElement, NextLinkProps>(
	function LinkBehaviour(props, ref) {
		return (
			<NextLink
				ref={ref}
				{...props}
			/>
		);
	}
);

const theme = createTheme({
	components: {
		MuiLink: {
			defaultProps: {
				component: LinkBehaviour,
			},
		},
		MuiButtonBase: {
			defaultProps: {
				LinkComponent: LinkBehaviour,
			},
		},
	},
});

export default LinkBehaviour;
