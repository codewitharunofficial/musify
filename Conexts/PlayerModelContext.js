import { createContext, useState } from "react";

const Model = createContext();

const PlayerModelConext = ({children}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Model.Provider value={{modalVisible, setModalVisible}} >
            {children}
        </Model.Provider>
    )
}

export {Model, PlayerModelConext};