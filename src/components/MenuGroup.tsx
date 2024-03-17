"use client";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import List from "@mui/material/List";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import MenuContext from "@/contexts/MenuContext";

export default function MenuGroup(props: { item: any }) {
	const { handleDrawerClose } = useContext(MenuContext);
	const router = useRouter();
	const path = usePathname();
	const { item } = props;
	const [open, setOpen] = React.useState(false);
	const handleClick = () => {
		setOpen(!open);
	};
	useEffect(() => {
		if (item.children) {
			item.children.forEach((child: any) => {
				if (path === child.path) {
					setOpen(true);
				}
			});
		}
	}, [item.children, open, path]);
	return !item.children ? (
		<ListItemButton
			selected={path === item.path}
			onClick={() => {
				router.push(item.path);
				handleDrawerClose();
			}}>
			<ListItemIcon>
				<item.icon />
			</ListItemIcon>
			<ListItemText primary={item.name} />
		</ListItemButton>
	) : (
		<>
			<ListItemButton onClick={handleClick}>
				<ListItemIcon>
					<item.icon />
				</ListItemIcon>
				<ListItemText primary={item.name} />
				{open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
			</ListItemButton>
			<Collapse
				in={open}
				timeout="auto"
				unmountOnExit>
				<List
					component="div"
					sx={{
						paddingLeft: 4,
					}}>
					{item.children.map((child: any, index: number) => (
						<MenuGroup
							item={child}
							key={index}></MenuGroup>
					))}
				</List>
			</Collapse>
		</>
	);
}
