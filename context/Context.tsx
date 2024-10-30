import react, {createContext} from "react";

const SelectedItemContext = createContext({
    selectedItem: null,
    setSelectedItem: () => {},
});
const ContextItemProvider = ({children}: any) => {
    const [selectedItem, setSelectedItem] = react.useState(null);
    return <SelectedItemContext.Provider value={{selectedItem, setSelectedItem}}>{children}</ContextItem.Provider>;
};
