import * as React from "react";

const MenuContext: React.Context<{ handleDrawerClose: () => void }> = React.createContext({
    handleDrawerClose: () => {    },
});
export default MenuContext;